
const route = require('express').Router();
const authentication = require('./authentication')
const nobackchat = require('./function')
const jwt = require('jsonwebtoken')
const database = require('./database')
require('dotenv').config();

route.get('/user',authentication, async (req, res) => { // add authentication to everything
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
    var all = req.query.all;
    if(all == "true") all = true;
    else all = false;
    if(chatid == null) {
        res.send(await nobackchat.getAllChat({id: result.id, all: all}));
    } else {
        res.send( await nobackchat.getChat({chatid: chatid, all: all, id: result.id}) );
    }
    // res.send({chatid: chatid, all: all, id: result.id});
});

route.post('/addtochat', async (req, res) => {
    id_ = req.cookies.session;
    id_ = jwt.verify(id_, process.env.SECRET);
    const result = await database.getUser({id: id_});
    var body = req.body;
    body.id = result.id;
    res.send(await nobackchat.addToChat(body));
});

route.get('/removefromchat', async (req, res) => {
    id_ = req.cookies.session;
    id_ = jwt.verify(id_, process.env.SECRET);
    const result = await database.getUser({id: id_});
    var body = req.body;
    body.id = result.id;
    res.send( await nobackchat.removeFromChat(body) );
});

route.get('/renamechat', async (req, res) => {

});

module.exports = route;