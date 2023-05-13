import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: [true, 'Please provide a username'] 
    },
    email: { 
        type: String, 
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'], 
        required: [true, 'Please provide an email'], 
        unique: true 
    },
    password: { 
        type: String, 
        required: [true, 'Please provide a password'] 
    },
    profilePic: String,
    bio: String,
    online: {
        type: Boolean,
        required: [true, 'Please provide online status'],
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: [true, 'Please provide a date']
    }
});

const User = mongoose.model('User', userSchema);
export default User;