import express from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { sendError } from './error';

const verifyToken = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return sendError(401, 'Unauthenticated user is not allowed to access this route', next);
    const token = authHeader.split(' ')[1];
    if (!(await jwt.verify(token, process.env.JWT_SECRET as string))) return sendError(401, 'Please provide a valid token', next);
    next();
});

export default verifyToken;