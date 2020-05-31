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
    data.member.push(data.id);
    var chat = new Chat({name: data.name, member: data.member.sort()});
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
    data.member.push(data.id);
    var chat = await Chat.findOne({member: data.member.sort()});
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
    try{
        var chat = await Chat.findOne({id: id, $all: [data.member] });
        return chat;
    } catch(err){
        return null;
    }
}

module.exports.sendMessage = async (data) => {
    var message = new Message(data);
    return await message.save();
}