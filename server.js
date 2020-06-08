const express = require('express')
const cookieParser = require('cookie-parser')
const body_parser = require('body-parser')
const auth = require('./auth')
const main = require('./main')
require('dotenv').config()

const app = express();
app.use(body_parser.json());
app.use(cookieParser());

// custom middlewares
app.use('/api/auth', auth); // auth middleware
app.use('/api/secure', main); // main middleware

app.get('/', (req, res) => res.send('haha'));

app.listen( process.env.port || 3000, async() => {
    console.log("server initiated");
});