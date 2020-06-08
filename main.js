const route = require('express').Router();
const validation = require('./validation')
const database = require('./database')
const authentication = require('./authentication')
require('dotenv').config()



route.post('/create_chat', authentication, async (req, res) => {
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
        var chat = await database.check_chat_with_exact_members({member: chatmember});
        if(!chat){ // not found .. make one
            chat = await database.create_chat_with_member({member: chatmember});
            await database.send_message({sender: "SYSTEM", body: "CONVERSATION STARTED"});
        }
        var fake_chat = {
            name: chat.name == "DEFAULT_CHAT_NAME" ? "" : chat.name,
            chatid: chat._id,
            member: chat.member,
            seen:  chat.seen,
            isGroup: chat.isGroup,
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

route.post('/message', authentication, async (req, res) => {
    if(!req.locals || !req.locals.isverified){ // unauthorized
        res.status(process.env.STATUS_UNAUTHORIZED).send()
        return 
    }
    var invalid = validation.message(req.body);
    if(invalid){
        res.status(process.env.STATUS_CONFLICT).send(invalid)
        return;
    }
    try{
        var data = req.body;
        if((await database.check_chat_with_id_and_members({id: data.chatid, member: [req.locals._id.toString()]}))._id.toString() != data.chatid){
            throw Error('No such chat found');
        }
        var msg = await database.send_message({
            sender: req.locals._id.toString(),
            link: data.link,
            chatid: data.chatid,
            body: data.body
        });
        await database.update_chat_date_and_seen({id: msg.chatid, date: msg.date, seen_to_add: msg.sender});
        res.send();
    } catch(err){
        res.status(process.env.STATUS_CONFLICT).send();
    }
});

route.get('/chat', authentication, async(req, res) => {
    if(!req.locals || !req.locals.isverified){ // unauthorized
        res.status(process.env.STATUS_UNAUTHORIZED).send()
        return 
    }
    try{
        var all = (req.query.all == 'true') ? true : false;
        var all_chat = await database.get_all_chat({id: req.locals._id.toString(), all: all});
        var to_send = [];
        all_chat.forEach(item => {
            var newthing = {};
            newthing.name = item.name == "DEFAULT_CHAT_NAME" ? "" : item.name,
            newthing.member =  item.member,
            newthing.seen = item.seen,
            newthing.lastUpdate = item.lastUpdate,
            newthing.isGroup = item.isGroup,
            newthing.chatid = item._id.toString()
            to_send.push(newthing);
        });
        res.send(to_send);
    } catch(err){
        res.status(process.env.STATUS_CONFLICT).send();
    }
});

route.get('/chat/:chatid', authentication, async (req, res) => {
    if(!req.locals || !req.locals.isverified){ // unauthorized
        res.status(process.env.STATUS_UNAUTHORIZED).send()
        return 
    }
    try{
        var chatid = req.params.chatid;
        var all = (req.query.all == 'true') ? true : false;
        if((await database.check_chat_with_id_and_members({id: chatid, member: [req.locals._id.toString()]}))._id.toString() != chatid){
            throw Error('No such chat found');
        }
        database.update_seen_in_chat({id: chatid, member: req.locals._id.toString()});
        var all_message = await database.get_all_messages({chatid: chatid, all: all});
        res.send(all_message);
     } catch(err){
         res.status(process.env.STATUS_CONFLICT).send();
     }
})

route.post('/create_group', authentication, async (req, res) => {
    if(!req.locals || !req.locals.isverified){ // unauthorized
        res.status(process.env.STATUS_UNAUTHORIZED).send()
        return 
    }
    var invalid = validation.create_group(req.body);
    if(invalid){
        res.status(process.env.STATUS_CONFLICT).send(invalid)
        return;
    }
    try{
        data = req.body;
        var member = data.members;
        member.push(req.locals._id.toString());
        member = [...new Set(member)]
        
        for(var index in member){
            var item = member[index];
            try{
                var jinis = await database.check_user_by_id({id: item});
                if(!jinis){
                    throw Error('No such thing');
                }    
            } catch(err){
                res.status(process.env.STATUS_CONFLICT).send();
                return;
            }
        }

        var chat = await database.create_chat_with_member({member: member, name: data.name, isGroup: true});
        var fake_chat = {
            name: chat.name == "DEFAULT_CHAT_NAME" ? "" : chat.name,
            chatid: chat._id,
            member: chat.member,
            seen:  chat.seen,
            isGroup: chat.isGroup,
            lastUpdate: chat.lastUpdate
        }
        res.send(fake_chat);
    } catch(err){
        res.status(process.env.STATUS_CONFLICT).send();
    }
})

route.post('/add', authentication, async (req, res) => {
    if(!req.locals || !req.locals.isverified){ // unauthorized
        res.status(process.env.STATUS_UNAUTHORIZED).send()
        return 
    }
    var invalid = validation.add(req.body);
    if(invalid){
        res.status(process.env.STATUS_CONFLICT).send(invalid)
        return;
    }
    if(req.body.members.length == 0){ // check if all are not currect members
        res.status(process.env.STATUS_CONFLICT).send("No members added");
        return;
    }
    try{
        var data = req.body;
        if((await database.check_chat_with_id_and_members({id: data.chatid, member: [req.locals._id.toString()]}))._id.toString() != data.chatid){
            throw Error('No such chat found');
        }
        //check if all are correct members
        for(var index in data.members){
            var item = data.members[index];
            try{
                var jinis = await database.check_user_by_id({id: item});
                var arekta = await database.check_chat_with_id_and_members({id: data.chatid, member:[item]});
                if(!jinis || arekta){
                    throw Error('No such thing');
                }    
            } catch(err){
                res.status(process.env.STATUS_CONFLICT).send();
                return;
            }
        }
        var chat = await database.check_chat_with_id({id: data.chatid});
        if(!chat.isGroup){
            res.status(process.env.STATUS_CONFLICT).send();
            return;
        }
        var member = data.members;
        var old_mem = new Set(chat.member);
        for(var index in member){
            old_mem.add(member[index]);
        }
        await database.update_member_of_chat({id: data.chatid, member: [...old_mem]});
        var msg = await database.send_message({
                sender: "SYSTEM",
                chatid: data.chatid,
                body: "ADDED",
                actor: req.locals._id.toString(),
                victim: data.members
            });
        database.update_chat_date_and_seen({id: msg.chatid, date: msg.date, seen_to_add: msg.actor});
        res.send();
    } catch (err) {
        res.status(process.env.STATUS_CONFLICT).send();
    }
})

route.post('/remove', authentication, async (req, res) => {
    if(!req.locals || !req.locals.isverified){ // unauthorized
        res.status(process.env.STATUS_UNAUTHORIZED).send()
        return 
    }
    var invalid = validation.add(req.body);
    if(invalid){
        res.status(process.env.STATUS_CONFLICT).send(invalid)
        return;
    }
    if(req.body.members.length == 0){ // check if all are not currect members
        res.status(process.env.STATUS_CONFLICT).send("No members added");
        return;
    }
    try{
        var data = req.body;
        if((await database.check_chat_with_id_and_members({id: data.chatid, member: [req.locals._id.toString()]}))._id.toString() != data.chatid){
            throw Error('No such chat found');
        }
        //check if all are correct members
        for(var index in data.members){
            var item = data.members[index];
            try{
                var jinis = await database.check_user_by_id({id: item});
                var arekta = await database.check_chat_with_id_and_members({id: data.chatid, member:[item]});
                if(!jinis || !arekta){
                    throw Error('No such thing');
                }    
            } catch(err){
                res.status(process.env.STATUS_CONFLICT).send();
                return;
            }
        }
        var chat = await database.check_chat_with_id({id: data.chatid});
        if(!chat.isGroup){
            res.status(process.env.STATUS_CONFLICT).send();
            return;
        }
        var member = data.members;
        var old_mem = new Set(chat.member);
        for(var index in member){
            old_mem.delete(member[index]);
        }
        await database.update_member_of_chat({id: data.chatid, member: [...old_mem]});
        var msg = await database.send_message({
                sender: "SYSTEM",
                chatid: data.chatid,
                body: "REMOVED",
                actor: req.locals._id.toString(),
                victim: data.members
            });
        database.update_chat_date_and_seen({id: msg.chatid, date: msg.date, seen_to_add: msg.actor});
        res.send();
    } catch (err) {
        res.status(process.env.STATUS_CONFLICT).send();
    }
});

route.post('/rename', authentication, async (req, res) => {
    if(!req.locals || !req.locals.isverified){ // unauthorized
        res.status(process.env.STATUS_UNAUTHORIZED).send()
        return 
    }
    var invalid = validation.rename(req.body);
    if(invalid){
        res.status(process.env.STATUS_CONFLICT).send(invalid)
        return;
    }
    var data = req.body;
    if((await database.check_chat_with_id_and_members({id: data.chatid, member: [req.locals._id.toString()]}))._id.toString() != data.chatid){
        throw Error('No such chat found');
    }
    await database.rename_chat({id: data.chatid, name: data.name});
    var msg = await database.send_message({
        sender: "SYSTEM",
        chatid: data.chatid,
        body: "RENAMED",
        actor: req.locals._id.toString()
    }); 
    database.update_chat_date_and_seen({id: msg.chatid, date: msg.date, seen_to_add: msg.actor});
    res.send();
});

route.get('/search', authentication, async (req, res) => {
    if(!req.locals || !req.locals.isverified){ // unauthorized
        res.status(process.env.STATUS_UNAUTHORIZED).send()
        return 
    }  
    try{
        var email = req.query.email;
        if(email == null){
            res.status(process.env.STATUS_CONFLICT).send("no email given")
            return;
        }
        const fake_user = await await database.check_user_by_email({email:email});
        if(fake_user && fake_user.isverified){
            user = {
                username: fake_user.username,
                email: fake_user.email,
                extra: fake_user.extra,
                userid: fake_user._id
            }
            res.send(user);
        } else {
            throw Error('No such thing');
        }
    } catch (err){
        res.status(404).send();
    }
});

module.exports = route;