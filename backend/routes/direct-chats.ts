import express from 'express';
import verifyToken from '../middlewares/auth';
import { updateWallpaper } from '../controllers/direct-chats';
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

router.patch('/update-wallpaper/:roomId', verifyToken, upload.single('wallpaper'), updateWallpaper);

export default router;