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
    }
});
module.exports = mongoose.model('Chat', chatSchema);