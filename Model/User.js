const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true 
    },
    password:{
        type: String,
        required: true 
    },
    extra:{
        type: Object,
        required: false
    }
});
module.exports = mongoose.model('User', userSchema);