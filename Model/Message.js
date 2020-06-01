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
    body:{
        type: String,
        required: true
    },
    system:{
        type: Boolean,
        required: true,
        default: false
    }
});
module.exports = mongoose.model('Message', messageSchema);