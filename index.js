const express = require("express");
//module for middleware
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");
const productsRouter = require("./routes/admin/products");
//required for express, app is what manipulate
const app = express();
//makes public folder available to outside world (aka css for browser), checks if request has path to css
app.use(express.static("public"));

//all middleware functions use this bodyParser, auto doesnt apply to get request
app.use(bodyParser.urlencoded({ extended: true }));
//npm package to create cookie, keys property used to encrypt cookie, adds property to req object (req.session)
app.use(cookieSession({ keys: ["asdfjkl"] }));
app.use(authRouter); //how to link up routes for different files
app.use(productsRouter);

//listen on port 3000 for request then run callback
app.listen(3000, () => {
  console.log("listening");
});
