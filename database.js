
const mongoose = require('mongoose')
const User = require('./Model/User')
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