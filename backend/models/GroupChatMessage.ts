import mongoose from "mongoose";

const groupChatMessageSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please provide a room id'],
        ref: 'GroupChatRoom'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        require: [true, 'Please provide a sender id'],
        ref: 'User'
    },
    text: {
        type: String,
        required: [true, 'Please provide the message sent by sender']
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: [true, 'Please provide a date']
    }
});

const GroupChatMessage = mongoose.model('GroupChatMessage', groupChatMessageSchema);
export default GroupChatMessage;