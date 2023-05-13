import mongoose from "mongoose";

const groupChatRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a group chat name'],
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please provide the admin for this group chat room'],
        ref: 'User'
    },
    users: {
        type: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        validate: [(value: any) => value.length >= 1, 'A group chat room must have at least one user'],
        required: [true, 'Please provide all users in a group chat room']
    },
    bio: String,
    groupPic: String,
    wallpaper: String,
    createdAt: {
        type: Date,
        default: Date.now,
        required: [true, 'Please provide a date']
    }
});

const GroupChatRoom = mongoose.model('GroupChatRoom', groupChatRoomSchema);
export default GroupChatRoom;