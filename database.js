
const mongoose = require('mongoose')
const User = require('./Model/User')
const Chat = require('./Model/Chat')
const Message = require('./Model/Message')
require('dotenv').config()

mongoose.connect(process.env.DATABASE,
 { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Database connected"));
    
module.exports.create_user = async (data) => {
    var user = new User(data);
    return await user.save();
}

module.exports.check_user_by_email = async (data) => {
    return await User.findOne({email: data.email});
}

module.exports.verify_user_by_id = async (data) => {
    return await User.updateOne({_id: data.id}, {$set: {is_email_verified: true}});
}

module.exports.check_user_by_email_password = async (data) => {
    return await User.findOne({email: data.email, password: data.password});
}

module.exports.check_user_by_id = async (data) => {
    return await User.findOne({_id: data.id});
}

module.exports.check_chat_with_members = async(data) => {
    return await Chat.findOne({member: data.member});
}

module.exports.create_chat_with_member = async (data) => {
    return await (new Chat({member: data.member})).save();
}

module.exports.send_message = async (data) => {
    return await (new Message(data)).save();
}

module.exports.check_chat_with_id_and_members = async (data) => {
    return await Chat.findOne({_id: data.id, member: {$all: data.member}});
}

module.exports.update_chat_date_and_seen = async (data) => {
    return await Chat.updateOne({_id: data.id}, {$set: {lastUpdate: data.date, seen: [data.seen_to_add]}});
}

module.exports.get_all_chat = async(data) => {
    if(data.all){
        return await Chat.find({member: {$all: [data.id]}}).sort({lastUpdate: -1});
    } else{
        return await Chat.find({member: {$all: [data.id]}}).sort({lastUpdate: -1}).limit(50);
    }
}

module.exports.get_all_messages = async(data) => {
    if(data.all) {
        return await Message.find({chatid: data.chatid}, {_id: 0, __v: 0});
    } else {
        return await Message.find({chatid: data.chatid}, {_id: 0, __v: 0}).limit(50);
    }
}

module.exports.update_seen_in_chat = async (data) => {
    // return await Chat.updateOne({_id: data.id}, )
    var chat = Chat.findOne({_id: id});
    var mem = chat.member;
    mem.push(data.member);
    mem = [...new Set(mem)];
    await Chat.updateOne({_id: data.id}, {$set: mem});
}