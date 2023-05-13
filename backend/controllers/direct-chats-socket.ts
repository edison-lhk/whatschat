import mongoose from 'mongoose';
import User from '../models/User';
import DirectChatRoom from '../models/DirectChatRoom';
import DirectChatMessage from '../models/DirectChatMessage';

const joinDirectChatRooms = (socket: any) => {
    return ({ roomIds }: { roomIds: string[] }) => {
        console.log('SOCKET join-direct-chat-rooms');
        if (!roomIds) return socket.emit('error', { message: 'Please provide room ids' });
        roomIds.forEach((roomId: string) => socket.join(`direct-chat-room: ${roomId}`));
    };
};

const createDirectChatRoom = (io: any, socket: any) => {
    return async ({ user2Id }: { user2Id: string }) => {
        console.log('SOCKET create-direct-chat-room');
        if (!user2Id) return socket.emit('error', { message: 'Please provide user2 id' });
        const user2 = await User.findOne({ _id: user2Id });
        if (!user2) return socket.emit('error', { message: 'User does not exist' });
        const roomExist = await DirectChatRoom.findOne({ users: { $in: [socket.data.userId, user2Id] } });
        if (roomExist) return socket.emit('error', { message: 'Room has already created' });
        const room = new DirectChatRoom({ users: [socket.data.userId, user2Id] });
        const savedRoom = await room.save();
        const populatedRoom = await savedRoom.populate('users');
        socket.emit('create-direct-chat-room', { room: populatedRoom });
        io.to(user2Id).emit('create-direct-chat-room', { room: populatedRoom });       
    };
};

const sendDirectChat = (io: any, socket: any) => {
    return async ({ roomId, message }: { roomId: string, message: string }) => {
        console.log('SOCKET send-direct-chat');
        if (!roomId || !message) return socket.emit('error', { message: 'Please provide all fields' });
        const directChatMessage = new DirectChatMessage({ roomId, sender: socket.data.userId, text: message });
        await directChatMessage.save();
        io.to(`direct-chat-room: ${roomId}`).emit('send-direct-chat', { newMessage: directChatMessage });
    };
};

const quitDirectChatRoom = (socket: any) => {
    return ({ roomId }: { roomId: string }) => {
        console.log('SOCKET quit-direct-chat-room');
        if (!roomId) return socket.emit('error', { message: 'Please provide room id' });
        socket.leave(`direct-chat-room: ${roomId}`);
    };
};

const deleteDirectChatRoom = (io: any, socket: any) => {
    return async ({ roomId }: { roomId: string }) => {
        console.log('SOCKET delete-direct-chat-room');
        if (!roomId) return socket.emit('error', { message: 'Please provide room id' });
        await DirectChatRoom.deleteOne({ _id: roomId });
        await DirectChatMessage.deleteMany({ roomId });
        io.to(`direct-chat-room: ${roomId}`).emit('delete-direct-chat-room', { roomId });
    };
};

const updateDirectChatRoomWallpaper = (io: any, socket: any) => {
    return async ({ roomId }: { roomId: string }) => {
        console.log('SOCKET update-direct-chat-room-wallpaper');
        if (!roomId) return socket.emit('error', { message: 'Please provide room id' });
        io.to(`direct-chat-room: ${roomId}`).emit('update-direct-chat-room-wallpaper', { roomId });
    };
};

export { joinDirectChatRooms, createDirectChatRoom, sendDirectChat, quitDirectChatRoom, deleteDirectChatRoom, updateDirectChatRoomWallpaper };