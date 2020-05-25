const mongoose = require('mongoose');
const User = require('./Model/User');
require('dotenv').config()

const DATABASE = "mongodb://" + process.env.DATABASEUSER + ":" + process.env.DATABASEPASSWORD + "@server1:27017,server2:27017,server3:27017/<DATABASE>?ssl=true&replicaSet=example-shard-0&authSource=admin"
mongoose.connect(DATABASE, { useUnifiedTopology: true , useNewUrlParser: true }, () => console.log("database connected"));

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

let signin = function(){

}

let signup = function(username, password){
    console.log(username, password);
}

let getUid = function(){

}

module.exports.signup = signup;