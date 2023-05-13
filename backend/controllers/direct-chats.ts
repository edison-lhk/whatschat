import express from 'express';
import asyncHandler from 'express-async-handler';
import { sendError } from '../middlewares/error';
import DirectChatRoom from '../models/DirectChatRoom';

const updateWallpaper = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { roomId } = req.params;
    if (!roomId || !req.file) return sendError(400, 'Please provide all fields', next);
    const room = await DirectChatRoom.findOneAndUpdate({ _id: roomId }, { wallpaper: `${process.env.BACKEND_URL}/uploads/${req.file.originalname}` });
    res.status(200).json({ success: true, message: "Room's wallpaper has successfully updated", wallpaper: room?.wallpaper });
});

export { updateWallpaper };