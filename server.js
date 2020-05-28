const express = require('express')
const cookies = require('cookies')
const body_parser = require('body-parser')
const nobackchat = require('./function')
const validation = require('./validation');

const app = express();
app.use(body_parser.json());


// routes
app.get('/', (req, res) => {
    res.send("putki");
});

app.post('/api/signup', async (req, res) => {
    const status = await nobackchat.signup(req.body);
    res.send(status);
});

app.post('/api/signin', async (req, res) => {
    const status = await nobackchat.signin(req.body);
    res.send(status);
});

app.listen(3000, () => console.log("Server initiated."));