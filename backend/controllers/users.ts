import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User';
import DirectChatRoom from '../models/DirectChatRoom';
import GroupChatRoom from '../models/GroupChatRoom';
import { sendError } from '../middlewares/error';

const getUserByEmail = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { email } = req.params;
    if (!email) return sendError(400, 'Please provide user email', next);
    const user = await User.findOne({ email });
    if (!user) return sendError(400, 'Email does not exist', next);
    res.status(200).json({ success: true, user: { _id: user._id, username: user.username, email: user.email, profilePic: user.profilePic, bio: user.bio, online: user.online } });
});

const getDirectChatRoomsOfUser = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { userId } = req.params;
    if (!userId) return sendError(400, 'Please provide user id', next);
    const rooms = await DirectChatRoom.find({ users: { $in: [userId] } }).populate('users');
    res.status(200).json({ success: true, rooms });
});

const getGroupChatRoomsOfUser = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { userId } = req.params;
    if (!userId) return sendError(400, 'Please provide user id', next);
    const rooms = await GroupChatRoom.find({ users: { $in: [userId] } }).populate('users').populate('admin');
    res.status(200).json({ success: true, rooms });
});

const getMutualGroupsofUsers = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { userIds } = req.params;
    if (!userIds) return sendError(400, 'Please provide user ids', next);
    const [user1Id, user2Id] = userIds.split('&');
    const rooms = await GroupChatRoom.find({ users: { $in: [user1Id, user2Id] } }).populate('users');
    res.status(200).json({ success: true, rooms });
});

const updateProfilePic = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { userId } = req.params;
    if (!req.file || !userId) return sendError(400, 'Please provide all fields', next);
    const user = await User.findOneAndUpdate({ _id: userId }, { profilePic: `${process.env.BACKEND_URL}/uploads/${req.file.originalname}` });
    res.status(200).json({ success: true, message: "User's profile pic has successfully updated", profilePic: user?.profilePic });
});

const updateUsername = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { userId } = req.params;
    const { username } = req.body;
    if (!username || !userId) return sendError(400, 'Please provide all fields', next);
    await User.updateOne({ _id: userId }, { username });
    res.status(200).json({ success: true, message: "User's username has successfully updated" })
});

const updateBio = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { userId } = req.params;
    const { bio } = req.body;
    if (!bio || !userId) return sendError(400, 'Please provide all fields', next);
    await User.updateOne({ _id: userId }, { bio });
    res.status(200).json({ success: true, message: "User's bio has successfully updated" })
});

export { getUserByEmail, getDirectChatRoomsOfUser, getGroupChatRoomsOfUser, getMutualGroupsofUsers, updateProfilePic, updateUsername, updateBio };