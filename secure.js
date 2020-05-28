
const route = require('express').Router();
const authentication = require('./authentication')
const nobackchat = require('./function')
const jwt = require('jsonwebtoken')
const User = require('./Model/User')
require('dotenv').config();

route.get('/uid', authentication, (req, res) => {
    id = req.cookies.id;
    id = jwt.verify(id, process.env.SECRET);
    res.send( User.find() );
});

module.exports = route;