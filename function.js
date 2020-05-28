const validation = require('./validation');
const jwt = require('jsonwebtoken');
const database = require('./database')
require('dotenv').config();


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