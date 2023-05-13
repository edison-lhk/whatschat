import mongoose from "mongoose";

const directChatRoomSchema = new mongoose.Schema({
    users: {
        type: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        validate: [(value: any) => value.length == 2, 'A direct chat room can only have two users'],
        required: [true, 'Please provide all users in a direct chat room'],
        unique: true
    },
    wallpaper: String,
    createdAt: {
        type: Date,
        default: Date.now,
        required: [true, 'Please provide a date']
    }
});

const DirectChatRoom = mongoose.model('DirectChatRoom', directChatRoomSchema);
export default DirectChatRoom;