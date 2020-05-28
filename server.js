const express = require('express')
const cookieParser = require('cookie-parser')
const body_parser = require('body-parser')
const nobackchat = require('./function')
const auth = require('./auth')
const secure = require('./secure')

const app = express();
app.use(body_parser.json());
app.use(cookieParser());

// custom middlewares
app.use('/api/auth', auth); // auth middleware
app.use('/api/secure', secure); //secure middleware

// app
app.get('/', (req, res) => {
    res.send("hello");
});

// app.get('/api/getuid', (req, res) => {
//     res.send(req.cookies.id);
// });

app.listen(3000, () => {
    var os = require("os");
    var hostname = os.hostname();
    console.log(hostname);
});