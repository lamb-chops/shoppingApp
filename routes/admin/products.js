const express = require("express");
const multer = require("multer");

const { handleErrors, requireAuth } = require("./middlewares");
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const productsIndexTemplate = require("../../views/admin/products/index");
const productsEditTemplate = require("../../views/admin/products/edit");
const { requireTitle, requirePrice } = require("./validators");
const products = require("../../repositories/products");

const router = express.Router();
//middleware
const upload = multer({ storage: multer.memoryStorage() });

//no () for require auth to provide reference, dont wanna call right now
router.get("/admin/products", requireAuth, async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productsIndexTemplate({ products: products }));
});

router.get("/admin/products/new", requireAuth, (req, res) => {
  res.send(productsNewTemplate({}));
});
//upload is middleware for storing image, putting it before other middleware allows pic to be interpreted correctly instead of urlencoded
router.post(
  "/admin/products/new",
  requireAuth,
  upload.single("image"),
  [requireTitle, requirePrice],
  //no () cuz passing reference to be called
  //middleware for errors
  handleErrors(productsNewTemplate),
  async (req, res) => {
    //how to get image from bytes uploaded
    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });
    //auto changes url to this with get request
    res.redirect("/admin/products");
  }
);
//:id is wildcard for whatever the unique id is
router.get("/admin/products/:id/edit", requireAuth, async (req, res) => {
  const product = await productsRepo.getOne(req.params.id);
  if (!product) {
    return res.send("Product not found");
  }
  res.send(productsEditTemplate({ product }));
});
module.exports = router;
