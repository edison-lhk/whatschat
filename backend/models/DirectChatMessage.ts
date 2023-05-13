import mongoose from "mongoose";

const directChatMessageSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please provide a room id'],
        ref: 'DirectChatRoom'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        require: [true, 'Please provide a sender id'],
        ref: 'User'
    },
    text: {
        type: String,
        required: [true, 'Please provide the text message sent by sender']
    },
    read: {
        type: Boolean,
        required: [true, 'Please provide read status'],
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: [true, 'Please provide a date']
    }
});

const DirectChatMessage = mongoose.model('DirectChatMessage', directChatMessageSchema);
export default DirectChatMessage;