const route = require('express').Router();
const validation = require('./validation')
const database = require('./database')
const authentication = require('./authentication')
require('dotenv').config()

route.post('/chat_info', authentication, async (req, res) => {
    if(!req.locals || !req.locals.isverified){ // unauthorized
        res.status(process.env.STATUS_UNAUTHORIZED).send()
        return 
    }
    try{
        var data = req.body;
        var invalid = validation.chatinfo(data);
        if(invalid){
            res.status(process.env.STATUS_CONFLICT).send(invalid)
            return;
        }
        var user = req.locals;
        var second_member = await database.check_user_by_id({id:data.member});
        if(!second_member){
            throw Error('No such data');
        }
        var chatmember = [user._id.toString(), data.member].sort();
        var chat = await database.check_chat_with_member({member: chatmember});
        if(!chat){ // not found .. make one
            chat = await database.create_chat_with_member({member: chatmember});
        }
        var fake_chat = {
            name: chat.name == "DEFAULT_CHAT_NAME" ? "" : chat.name,
            chatid: chat._id,
            member: chat.member,
            seen:  chat.seen,
            lastUpdate: chat.lastUpdate
        }
        res.send(fake_chat);
    } catch(err){
        res.status(process.env.STATUS_CONFLICT).send();
    }
})

route.get('/user', authentication, async (req, res) => {
    if(!req.locals || !req.locals.isverified){ // unauthorized
        res.status(process.env.STATUS_UNAUTHORIZED).send()
        return 
    }
    if(req.query.userid == null){
        user = {
            username: req.locals.username,
            email: req.locals.email,
            extra: req.locals.extra,
            userid: req.locals._id
        }
        res.send(user);
    } else {
        try{
            const fake_user = await database.check_user_by_id({id: req.query.userid});
            if(fake_user && fake_user.isverified){
                user = {
                    username: fake_user.username,
                    email: fake_user.email,
                    extra: fake_user.extra,
                    userid: fake_user._id
                }
                res.send(user);
            }
        } catch(err){
            res.status(process.env.STATUS_NOT_FOUND).send();
        }
    }
})

module.exports = route;