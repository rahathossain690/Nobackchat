
const route = require('express').Router();
const authentication = require('./authentication')
const nobackchat = require('./function')
const jwt = require('jsonwebtoken')
const database = require('./database')
require('dotenv').config();

route.get('/user', authentication, async (req, res) => {
    try{
        id_ = req.cookies.session;
        id_ = jwt.verify(id_, process.env.SECRET);
        const result = await database.getUser({id: id_});
        var final = {
            username : result.username,
            isverified: result.isverified,
            extra: result.extra,
            id: result._id
        }
        res.send(final);
    } catch (error){
        res.send("error");
    }
});

// route.post('/user', async (req, res) => {
//     res.send( await database.createChat(req.body) );
// });

route.post('/message', async (req, res) => {
    id_ = req.cookies.session;
    id_ = jwt.verify(id_, process.env.SECRET);
    const result = await database.getUser({id: id_});
    var body = req.body;
    body["sender"] = result.id;
    res.send( await nobackchat.sendMessage(body) );
});

route.get('/message', async (req, res) => {
    id_ = req.cookies.session;
    id_ = jwt.verify(id_, process.env.SECRET);
    const result = await database.getUser({id: id_});
    var chatid = req.query.chatid;
    if(chatid == null) res.send({status: "failed", message: "chatid required"});
    var all = req.query.all;
    if(all == "true") all = true;
    else all = false;
    res.send( await nobackchat.getChat({chatid: chatid, all: all, id: result.id}) );
    // res.send({chatid: chatid, all: all, id: result.id});
});

module.exports = route;