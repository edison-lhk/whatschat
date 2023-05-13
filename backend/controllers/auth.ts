import express from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { sendError } from '../middlewares/error';

const loginUser = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) return sendError(400, 'Please provide all fields', next);
    const user = await User.findOne({ email });
    if (!user) return sendError(400, 'User does not exist', next);
    if (!(await bcrypt.compare(password, user.password))) return sendError(400, 'Password is not correct', next);
    const token = jwt.sign({ _id: user._id, username: user.username, email: user.email, profilePic: user.profilePic, bio: user.bio }, process.env.JWT_SECRET as string);
    res.status(200).json({ success: true, message: 'User has successfully logged in', user: { _id: user._id, username: user.username, email: user.email, profilePic: user.profilePic, bio: user.bio } , token });
});

const signUpUser = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return sendError(400, 'Please provide all fields', next);
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) return sendError(400, 'Please provide a valid email', next);
    if (password.length < 8) return sendError(400, 'Please provide a valid password with 8 characters or more', next);
    const hashedPassword = await bcrypt.hash(password, 10);
    if (await User.findOne({ email })) return sendError(400, 'Email has already been used', next);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ success: true, message: 'New user has successfully created' });
});

export { loginUser, signUpUser };