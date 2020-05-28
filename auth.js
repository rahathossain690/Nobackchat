
const route = require('express').Router();
const nobackchat = require('./function')

route.post('/signup', async (req, res) => {
    const status = await nobackchat.signup(req.body);
    res.send(status);
});

route.post('/signin', async (req, res) => {
    const status = await nobackchat.signin(req.body);
    if(status.status == "success"){
        res.cookie('id', status.id);
    }
    res.send(status);
});

route.get('/signout', (req, res) => {
    res.clearCookie('id');
    res.send("signout success");
});

module.exports = route;