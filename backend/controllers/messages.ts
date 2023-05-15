import express from 'express';
import asyncHandler from 'express-async-handler';
import DirectChatMessage from '../models/DirectChatMessage'
import GroupChatMessage from '../models/GroupChatMessage';
import { sendError } from '../middlewares/error';

const getDirectChatMessagesByRoomId = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { roomId } = req.params;
    if (!roomId) return sendError(400, 'Please provide room id', next);
    const messages = await DirectChatMessage.find({ roomId }).populate('sender');
    res.status(200).json({ success: true, messages });
});

const getLatestDirectChatMessageByRoomId = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { roomId } = req.params;
    if (!roomId) return sendError(400, 'Please provide room id', next);
    const message = await DirectChatMessage.find({ roomId }).populate('sender').sort('-createdAt').limit(1);
    res.status(200).json({ success: true, message: message[0] });
});

const getGroupChatMessagesByRoomId = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { roomId } = req.params;
    if (!roomId) return sendError(400, 'Please provide room id', next);
    const messages = await GroupChatMessage.find({ roomId }).populate('sender');
    res.status(200).json({ success: true, messages });
});

const getLatestGroupChatMessageByRoomId = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { roomId } = req.params;
    if (!roomId) return sendError(400, 'Please provide room id', next);
    const message = await GroupChatMessage.find({ roomId }).populate('sender').sort('-createdAt').limit(1);
    res.status(200).json({ success: true, message: message[0] });
});

export { getDirectChatMessagesByRoomId, getLatestDirectChatMessageByRoomId, getGroupChatMessagesByRoomId, getLatestGroupChatMessageByRoomId };