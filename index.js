const express = require('express')
    //required for express, app is what manipulate
const app = express()
    //route handler, request and response objects, .get means wait for get request and path of '/'
app.get('/', (req, res) => {
    res.send("hi there")
})

//listen on port 3000 for request then run callback
app.listen(3000, () => {
    console.log("listening")
})