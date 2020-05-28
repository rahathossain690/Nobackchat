
var joi = require('@hapi/joi')

const signupSchema = joi.object({
    username: joi.string().min(6).required(),
    password: joi.string().min(6).required(),
    extra: joi.object()
});

const signinSchema = joi.object({
    username: joi.string().min(6).required(),
    password: joi.string().min(6).required()
});

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

module.exports.signup = signupValidate;
module.exports.signin = signinValidate;