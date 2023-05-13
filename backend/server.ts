import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/connectDB';
import morgan from 'morgan';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import messagesRouter from './routes/messages';
import directChatsRouter from './routes/direct-chats';
import groupChatsRouter from './routes/group-chats';
import directChatsSocketRouter from './routes/direct-chats-socket';
import groupChatsSocketRouter from './routes/group-chats-socket';

// Create backend server
const app = express();
const server = http.createServer(app);
export const io = new Server(server);

// .env config
dotenv.config();

// connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Server Images
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/direct-chats', directChatsRouter);
app.use('/api/group-chats', groupChatsRouter);
io.on('connection', socket => {
    socket.on('login', ({ userId }) => {
        socket.data.userId = userId;
        socket.join(userId);
    });
    directChatsSocketRouter(io, socket);
    groupChatsSocketRouter(io, socket);
});

// Error Handler
import errorHandler from "./middlewares/error";
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));