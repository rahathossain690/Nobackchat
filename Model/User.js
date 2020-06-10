const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true 
    },
    isverified: {
        type: Boolean,
        default: false,
        required: true
    },
    extra:{
        type: Object,
        required: false
    },
    friend:{
        type: Array,
        required: true,
        default: []
    }
});
module.exports = mongoose.model('User', userSchema);