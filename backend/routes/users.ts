import express from 'express';
import verifyToken from '../middlewares/auth';
import { getUserByEmail, getDirectChatRoomsOfUser, getGroupChatRoomsOfUser, getMutualGroupsofUsers, updateProfilePic, updateUsername, updateBio } from '../controllers/users';
import multer from 'multer';
import path from 'path';

const multerStorage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, path.join(__dirname, '../public'));
    },
    filename: (req: any, file: any, cb: any) => {
        cb(null, `uploads/${file.originalname}`);
    }
});

const multerFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.split('/')[0] === 'image') {
        cb(null, true);
    } else {
        cb(new Error('Not a image file!!'), false);
    }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const router = express.Router();

router.get('/:email', verifyToken, getUserByEmail);
router.get('/get-direct-chat-rooms/:userId', verifyToken, getDirectChatRoomsOfUser);
router.get('/get-group-chat-rooms/:userId', verifyToken, getGroupChatRoomsOfUser);
router.get('/get-mutual-groups/:userIds', verifyToken, getMutualGroupsofUsers);
router.patch('/update-profile-pic/:userId', verifyToken, upload.single('profile-pic'), updateProfilePic);
router.patch('/update-username/:userId', verifyToken, updateUsername);
router.patch('/update-bio/:userId', verifyToken, updateBio);

export default router;