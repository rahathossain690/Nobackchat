const express = require('express')
const cookies = require('cookies')
require('dotenv').config()
const body_parser = require('body-parser')

const app = express();

app.use(body_parser.json());

app.get('/getuid', (req, res) => {
    
});

app.listen(3000);