
const route = require('express').Router();
const nobackchat = require('./function')

route.post('/signup', async (req, res) => {
    const status = await nobackchat.signup(req.body);
    res.send(status);
});

route.post('/signin', async (req, res) => {
    const status_ = await nobackchat.signin(req.body);
    if(status_.status == "success"){
        res.cookie('session', status_.id);
    }
    res.send({status: status_.status});
});

route.get('/signout', (req, res) => {
    res.clearCookie('session');
    res.send("signout success");
});

module.exports = route;