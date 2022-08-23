const express = require("express");
//module for middleware
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
//required for express, app is what manipulate
const app = express();
const usersRepo = require("./repositories/users");
//all middleware functions use this bodyParser, auto doesnt apply to get request
app.use(bodyParser.urlencoded({ extended: true }));
//npm package to create cookie, keys property used to encrypt cookie, adds property to req object (req.session)
app.use(cookieSession({ keys: ["asdfjkl"] }));

//route handler, request and response objects, .get means wait for get request and path of '/'
app.get("/", (req, res) => {
  res.send(`
    <div>
    Your ID is: ${req.session.userId}
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password"placeholder="password" />
            <input name="passwordConfirmation"placeholder="password confirmation" />
            <button>Sign Up</button>
        </form>
    </div>
    `);
});

app.post("/", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;
  //check if someone signed up with email before
  const existingUser = await usersRepo.getOneBy({ email: email });
  if (existingUser) {
    return res.send("Email in use.");
  }
  if (password !== passwordConfirmation) {
    return res.send("Passwords must match.");
  }

  const user = await usersRepo.create({ email: email, password: password });
  req.session.userId = user.id; //added by cookie-session, attached auto to req
  res.send("Account created");
});

//listen on port 3000 for request then run callback
app.listen(3000, () => {
  console.log("listening");
});
