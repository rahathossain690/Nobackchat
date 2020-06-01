const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        default: 'DEFAULT_CHAT_NAME'
    },
    member: {
        type: Array,
        required: true
    },
    seen: {
        type: Array,
        required: true,
        default: []
    },
    lastUpdate:{
        type: Date,
        required: true,
        default: Date.now()
    }
});
module.exports = mongoose.model('Chat', chatSchema);