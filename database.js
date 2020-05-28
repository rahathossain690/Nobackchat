const mongoose = require('mongoose');
const User = require('./Model/User');
require('dotenv').config()

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log("database connected"));

module.exports.signin = async (data) => {
    const result = await User.findOne({ username: data.username, password: data.password});
    return result;
}

module.exports.signupCheckExistence = async (data) => {
    return User.findOne( {username: data.username} );
}

module.exports.signup = async (data) => {
    var user = new User({username : data.username, password: data.password, extra: data.extra});
    var savedUser = await user.save();
    return savedUser;
}