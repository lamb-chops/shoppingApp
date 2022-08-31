const express = require('express')
const { validationResult } = require('express-validator')
const multer = require('multer')

const productsRepo = require('../../repositories/products')
const productsNewTemplate = require('../../views/admin/products/new')
const { requireTitle, requirePrice } = require('./validators')

const router = express.Router()
    //middleware
const upload = multer({ storage: multer.memoryStorage() })

router.get('/admin/products', (req, res) => {

})

router.get('/admin/products/new', (req, res) => {
        res.send(productsNewTemplate({}))
    })
    //upload is middleware for storing image, putting it before other middleware allows pic to be interpreted correctly instead of urlencoded
router.post('/admin/products/new', upload.single('image'), [requireTitle, requirePrice], async(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.send(productsNewTemplate({ errors }))
    }
    //how to get image from bytes uploaded
    const image = req.file.buffer.toString('base64')
    const { title, price } = req.body
    await productsRepo.create({ title, price, image })
    res.send("submitted")
})
module.exports = router