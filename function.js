const validation = require('./validation');
const jwt = require('jsonwebtoken');
const database = require('./database')
require('dotenv').config();


/*
data{
    chatid:?, sender:, link:?, body
}
validate first
if chatid: save msg to chatid
else create chat, use chatid to save msg
*/
let sendMessage = async function(data){
    //verify
    const invalid = validation.message(data);
    if(invalid) return {status: "failed", message: invalid};
    // fetch chatid if not given
    if(!!data.chatid){ // verify chatid
        if( await database.checkChatById({id: data.chatid}) == null) {
            return {status: "failed", message: "wrong chatid"};
        }
        var chat = database.checkChatWithMemberAndId({id: data.chatid, member: data.sender});
        if(chat == null) return {status: "failed", message: "permission denied"};
    } else {
        try{ // get chat id if existed
            data["chatid"] = await (await database.checkChatByMember({id: data.sender, member: data.member}))._id;
        } catch(err){// create chatid if not existed
            data["chatid"] = await (await database.createChat({id: data.sender, member: data.member}))._id;
        }
    }
    await database.makeSeenMessage({chatid: data.chatid, id: data.sender});
    // send message
    return database.sendMessage(data);
}

/*
@param: data{
    id
}

*/
let getAllChat = async function(data){
    var chats = await database.getAllChat(data);
    for(var i = 0; i < chats.length; i++){
        if(chats[i].name === "DEFAULT_CHAT_NAME") chats[i].name = "";
    }
    return chats;
}

/*
@param data{
    id, chatid, all:?
}
check if valid data
check if sender has access to that chatid
give chat all data if all 
give last 50 
also make that data seen for reciever
*/
let getChat = async function(data){
    var chat = database.checkChatWithMemberAndId({id: data.chatid, member: data.id});
    if(chat == null) return {status: "failed", message: "permission denied"};
    return database.getMessage({chatid: data.chatid, id: data.id, all: data.all});
}

let addToChat = async function(data){
    //verify
    const invalid = validation.addToChat(data);
    if(invalid) return {status: "failed", message: invalid};
    var chat = await database.checkChatWithMemberAndId({id: data.chatid, member: data.id});
    if(chat == null) return {status: "failed", message: "permission denied"};
    return await database.addToChat(data);
}

let removeFromChat = async function(data){
    var chat = await database.checkChatWithMemberAndId({id: data.chatid, member: data.id});
    if(chat == null) return {status: "failed", message: "permission denied"};
    return await database.removeFromChat(data);
}

let renameChat = function(){

}

/*
@param data={username, password}
validate data
match username, password
return {status : success, id: _id} if success
returns {status: failed, message: _message} else
*/
let signin = async function(data){
    try{
        //verify
        const invalid = validation.signin(data);
        if(invalid) return {status: "failed", message: invalid};
        // to the database
        const result = await database.signin(data);
        if(result == null) return {status: "failed", message: "incorrect username or password"};
        const token = jwt.sign(result.id, process.env.SECRET);
        return {status: "success", id: token}
    } catch(error){
        return {status: "failed", message: "signin failed"};
    }
}

let verifyUser = async function(data){
    
}

/*
@param data = {username, password, extra?}
checks if valid data
checks if unique data
return {status : success, id: _id} if success
returns {status: failed, message: _message} else
*/ 
let signup = async function(data){
    try{
        //verify
        const invalid = validation.signup(data);
        if(invalid) return {status: "failed", message: invalid};
        // check for existing username
        // return await User.findOne( {username: data.username});
        if(!!await database.signupCheckExistence(data)) {
            return {status: "failed", message: "username exits already"}
        }
        await database.signup(data);
        return {status: "success"}
    } catch(error){
        return {status: "failed", message: "signup failed"};
    }
}

module.exports.signup = signup;
module.exports.signin = signin;
module.exports.sendMessage = sendMessage;
module.exports.getChat = getChat;
module.exports.getAllChat = getAllChat;
module.exports.addToChat = addToChat;
module.exports.removeFromChat = removeFromChat;
module.exports.renameChat = renameChat;
