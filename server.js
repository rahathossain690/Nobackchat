const express = require('express')
const cookieParser = require('cookie-parser')
const body_parser = require('body-parser')
const auth = require('./auth')
const main = require('./main')
const cors = require('cors');
require('dotenv').config()

const app = express();
app.use(body_parser.json());
app.use(cookieParser());
app.use(cors());

// custom middlewares
app.use('/api/auth', auth); // auth middleware
app.use('/api/secure', main); // main middleware

app.get('/', (req, res) => res.send('server is up!'));

app.listen( process.env.port || 3000, async() => {
    console.log("server initiated");
});