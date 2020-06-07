const express = require('express')
const cookieParser = require('cookie-parser')
const body_parser = require('body-parser')
const auth = require('./auth')
const main = require('./main')

const app = express();
app.use(body_parser.json());
app.use(cookieParser());

// custom middlewares
app.use('/api/auth', auth); // auth middleware
app.use('/api/secure', main); // main middleware

app.listen(3000, () => {
    console.log("server initiated");
});