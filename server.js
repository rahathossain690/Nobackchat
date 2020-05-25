const express = require('express')
const cookies = require('cookies')
const body_parser = require('body-parser')
const {nobackchat} = require('./function')

const app = express();

app.use(body_parser.json());

app.get('/', (req, res) => {
    res.send("putki");
});

app.post('/signup', (req, res) => {
    // try{
        nobackchat.signup(req.body.username, req.body.password);
        res.send({"status": "success"});
    // } catch(err){
    //     res.send({"status": "failed"});
    // }
});

app.listen(3000);