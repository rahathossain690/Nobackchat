const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    sender:{
        type: String,
        required: true
    },
    chatid:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true,
        default: Date.now()
    },
    link:{
        type: String,
        required: true,
        default: false 
    },
    seenby:{
        type: Array,
        required: true,
    }
});
module.exports = mongoose.model('Message', messageSchema);