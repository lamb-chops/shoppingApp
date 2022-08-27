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
app.get('/signup', (req, res) => {
    res.send(`
        <div>
            <form> method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <input name="passwordConfirmation" placeholder="passwordConfirmation" />
                <button>Sign In</button>
            </form>
        </div>
    `);
});

app.post('/signup', async(req, res) => {
    const { email, password, passwordConfirmation } = req.body
        //check if someone signed up with email before
    const existingUser = await usersRepo.getOneBy({ email: email })
    if (existingUser) {
        return res.send("Email in use.")
    }
    if (password !== passwordConfirmation) {
        return res.send("Passwords must match.")
    }

    const user = await usersRepo.create({ email: email, password: password })
    req.session.userId = user.id //added by cookie-session, attached auto to req, .session empty obj at first
    res.send("Account created")
})

app.post("/", async(req, res) => {
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

app.get('/signout', (req, res) => {
    //deleting cookie forgets user
    req.session = null
    res.send("You are logged out.")
})

app.get('/signin', (req, res) => {
    res.send(` 
        <div>
            <form> method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <button>Sign In</button>
            </form>
        </div>
    `)
});

app.post('/signin', async(req, res) => {
    //email and password from names put on form
    const { email, password } = req.body

    const user = await usersRepo.getOneBy({ email: email })

    if (!user) {
        return res.send("Email not found.")
    }
    if (user.password !== password) {
        return res.send("Invalid Password")
    }
    req.session.userId = user.id
    res.send("You are signed in")
})

//listen on port 3000 for request then run callback
app.listen(3000, () => {
    console.log("listening");
});