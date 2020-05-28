const mongoose = require('mongoose');
const User = require('./Model/User');
const validation = require('./validation');
require('dotenv').config();

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("database connected"));

let createChat = function(){

}

let sendMessage = function(){

}

let getAllChat = function(){

}

let getChat = function(){

}

let addToChat = function(){

}

let removeFromChat = function(){

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
        // rest
        const result = await User.findOne({ username: data.username, password: data.password});
        if(result == null) return {status: "failed", message: "incorrect username or password"};
        return {status: "success", id: result.id};
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
        if(!!await User.findOne( {username: data.username} )) {
            return {status: "failed", message: "username exits already"}
        }
        // add to database
        var user = new User({username : data.username, password: data.password, extra: data.extra});
        var savedUser = await user.save();
        return {status: "success", id:savedUser.id};
    } catch(error){
        return {status: "failed", message: "signup failed"};
    }
}

let getUid = function(){

}

let signout = function(){

}

module.exports.signup = signup;
module.exports.signin = signin;
module.exports.signout = signout;

//////// CHECKER FUNCTIONS ////////
let getAllChatofALl = function(){

}

let getAllUser = function(){

}