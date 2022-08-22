const express = require('express')
    //module for middleware
const bodyParser = require('body-parser')
    //required for express, app is what manipulate
const app = express()
    //all middleware functions use this bodyParser, auto doesnt apply to get request
app.use(bodyParser.urlencoded({ extended: true }))
    //route handler, request and response objects, .get means wait for get request and path of '/'
app.get('/', (req, res) => {
        res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password"placeholder="password" />
            <input name="passwordConfirmation"placeholder="password confirmation" />
            <button>Sign Up</button>
        </form>
    </div>
    `)
    })
    //middleware function= modifies request before sending it, next is callback func from express

//run bodyparser library middleware first, when next is called it returns here and info in req.body
app.post('/', (req, res) => {
    //similiar to addeventlistener, but waiting for data event now. data obj in buffer in hex, sends in chunks if large

    res.send("Account created")
})

//listen on port 3000 for request then run callback
app.listen(3000, () => {
    console.log("listening")
})