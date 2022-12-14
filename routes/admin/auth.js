const express = require("express");

const { handleErrors } = require("./middlewares");
const usersRepo = require("../../repositories/users"); //relative path for files we make
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExist,
  requireValidPasswordForUser,
} = require("./validators");
const { check, validationResult } = require("express-validator"); //need for errors in custom validation
//works just like app obj in index.js, will link router to app in index
const router = express.Router();

//route handler, request and response objects, .get means wait for get request and path of '/'
router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req: req }));
});
//check is middleware imported, checks if valid inputs with built in validator methods in docs
//sanitize (fix) then validate, ignore first method cuz auto passed in with express
//can create custom validators
router.post(
  "/signup",
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body;
    const user = await usersRepo.create({ email: email, password: password });
    req.session.userId = user.id; //added by cookie-session, attached auto to req, .session empty obj at first
    res.redirect("admin/products");
  }
);

router.get("/signout", (req, res) => {
  //deleting cookie forgets user
  req.session = null;
  res.send("You are logged out.");
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate({})); //pass en empty obj to prevent errors when need params later
});

router.post(
  "/signin",
  [requireEmailExist, requireValidPasswordForUser],
  handleErrors(signinTemplate),
  async (req, res) => {
    const errors = validationResult(req);

    //email and password from names put on form
    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email: email });

    req.session.userId = user.id;
    res.redirect("admin/products");
  }
);

module.exports = router; //makes routes available elsewehre
