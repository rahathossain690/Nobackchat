
var joi = require('@hapi/joi')

const signupSchema = joi.object({
    email: joi.string().email().required(),
    username: joi.string().min(6).required(),
    password: joi.string().min(6).required(),
    extra: joi.object()
});

const signinSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
});

const messageSchema = joi.object({
    chatid: joi.string().min(2).required(),
    link: joi.boolean(),
    body: joi.string().min(1).required()
});

// const addToChatSchema = joi.object({
//     member: joi.array().required(),
//     chatid: joi.string().min(6),
//     id: joi.string().required()
// });

// var addToChatValidate = function(data){
//     const val = addToChatSchema.validate(data);
//     if(!!val.error){
//         return val.error.details[0].message;
//     } else{
//         return false;
//     }
// }

var signupValidate = function(data){
    const val = signupSchema.validate(data);
    if(!!val.error){
        return val.error.details[0].message;
    } else{
        return false;
    }
}

var signinValidate = function(data){
    const val = signinSchema.validate(data);
    if(!!val.error){
        return val.error.details[0].message;
    } else{
        return false;
    }
}

module.exports.message = function(data){
    const val = messageSchema.validate(data);
    if(!!val.error){
        return val.error.details[0].message;
    } else{
        return false;
    }
}

const chatinfo = joi.object({
    member: joi.string().required()
});

module.exports.chatinfo = function(data){
    const val = chatinfo.validate(data);
    if(!!val.error){
        return val.error.details[0].message;
    } else{
        return false;
    }
}

module.exports.signup = signupValidate;
module.exports.signin = signinValidate;