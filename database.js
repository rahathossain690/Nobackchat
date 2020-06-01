const mongoose = require('mongoose');
const User = require('./Model/User');
const Chat = require('./Model/Chat');
const Message = require('./Model/Message')
require('dotenv').config()

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("database connected"));


/*
@param data{
    username:
    password:
}
*/
module.exports.signin = async (data) => {
    const result = await User.findOne({ username: data.username, password: data.password});
    return result;
}

/*
@param data{
    username: uname
}
*/
module.exports.signupCheckExistence = async (data) => {
    return await User.findOne( {username: data.username} );
}

/*
@param data{
    username: uname
    password: password
    extra: extra?
}
*/
module.exports.signup = async (data) => {
    var user = new User({username : data.username, password: data.password, extra: data.extra});
    var savedUser = await user.save();
    return savedUser;
}

/*
@param data{
    id: id
}
*/
module.exports.getUser = async (data) => {
    return await User.findOne({_id: data.id});
}

/*
@param data{
    member: [memberids],
    id: creatorid,
    name: name?
}
*/
module.exports.createChat = async (data) => {
    var mem = data.member;
    mem.push(data.id);
    var chat = new Chat({name: data.name, member: mem.sort()});
    return await chat.save(); 
}

/**
 * {
    "name": "Shera Chat",
    "member": [
        "1",
        "2",
        "3"
    ],
    "_id": "5ed41aeb6d603b2aeaf391bb",
    "__v": 0
}
 * 
 */

module.exports.checkChatByMember = async (data) => {
    var mem = data.member;
    mem.push(data.id);
    var chat = await Chat.findOne({member: mem.sort()});
    return chat;
}


module.exports.checkChatById = async (data) => {
    try{
        var chat = await Chat.findOne({_id: data.id});
        return chat;
    } catch(err){
        return null;
    }
}

module.exports.checkChatWithMemberAndId = async (data) => {
    // try{
        var chat = await Chat.findOne({_id: data.id, member: {$all: [data.member] }});
        return chat;
    // } catch(err){
    //     return null;
    // }
}

var sm = async (data) => {
    await Chat.updateOne({_id: data.chatid}, {$set: {lastUpdate: Date.now()}});
    var message = new Message(data);
    return await message.save();
}

module.exports.sendMessage = sm;

module.exports.getMessage = async (data) => {
    var chat = await Chat.findOne({_id: data.chatid});
    chat.seen.push(data.id);
    chat.seen = [ ...new Set(chat.seen)]  
    await Chat.updateOne({_id: data.chatid}, {$set: {seen: chat.seen}});
    if(data.all == true){
        return await Message.find({chatid: data.chatid}, {__v: 0, _id: 0, chatid: 0})
    } else{
        return await Message.find({chatid: data.chatid}, {__v: 0, _id: 0, chatid: 0}).limit(50);
    }
}

module.exports.makeSeenMessage = async (data) => {
    await Chat.updateOne({_id: data.chatid}, {$set: {seen: [data.id]}});
}

module.exports.getAllChat = async (data) => {
    if(data.all){
        return await Chat.find({member: {$all: [data.id]}}, {_id: 0, __v: 0}).sort({date: -1})
    } else{
        return await Chat.find({member: {$all: [data.id]}}, {_id: 0, __v: 0}).sort({date: -1}).limit(50)
    }
}

module.exports.addToChat = async (data) => {
    var chat = await Chat.findOne({_id: data.chatid});
    var newmember = chat.member;
    var yeah = false;
    data.member.forEach(async (element) => {
        try{
            var user = await User.findOne({_id: element});
            if( user._id != element) {
                newmember.push(element);
                yeah = true;
            }
        } catch(err){
            // currently do nothing
        }
    });
    if(!yeah) return null;
    newmember = [ ...new Set(chat.member)];
    sm({sender: data.id, chatid: data.chatid, system: true, body: "Member added"});
    return await Chat.updateOne({_id: chat.id}, {$set: {member: chat.member}});
};

module.exports.removeFromChat = async (data) => {
    var chat = await Chat.findOne({_id: data.chatid});
    var newmember = chat.member;
    var yeah = false;
    var prev_member = new Set(chat.member);
    prev_member.delete(data.member);
    if(!yeah) return null;
    newmember = [ ...new Set(chat.member)];
    sm({sender: data.id, chatid: data.chatid, system: true, body: "Member added"});
    return await Chat.updateOne({_id: chat.id}, {$set: {member: chat.member}});
    
}