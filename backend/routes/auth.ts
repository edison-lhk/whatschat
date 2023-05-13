import express from 'express';
import { loginUser, signUpUser } from '../controllers/auth';

const router = express.Router();

router.post('/login', loginUser);
router.post('/sign-up', signUpUser);

export default router;