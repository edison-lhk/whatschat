import express from 'express';
import verifyToken from '../middlewares/auth';
import { getDirectChatMessagesByRoomId, getLatestDirectChatMessageByRoomId, getGroupChatMessagesByRoomId, getLatestGroupChatMessageByRoomId } from '../controllers/messages';

const router = express.Router();

router.get('/direct-chat/:roomId', verifyToken, getDirectChatMessagesByRoomId);
router.get('/direct-chat/latest/:roomId', verifyToken, getLatestDirectChatMessageByRoomId);
router.get('/group-chat/:roomId', verifyToken, getGroupChatMessagesByRoomId);
router.get('/group-chat/latest/:roomId', verifyToken, getLatestGroupChatMessageByRoomId);

export default router;