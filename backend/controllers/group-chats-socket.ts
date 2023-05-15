import GroupChatRoom from '../models/GroupChatRoom';
import GroupChatMessage from '../models/GroupChatMessage';

const joinGroupChatRooms = (socket: any) => {
    return ({ roomIds }: { roomIds: string[] }) => {
        console.log('SOCKET join-group-chat-rooms');
        if (!roomIds) return socket.emit('error', { message: 'Please provide room ids' });
        roomIds.forEach((roomId: string) => {
            socket.join(`group-chat-room: ${roomId}`);
            socket.broadcast.to(`group-chat-room: ${roomId}`).emit('online-notification', { roomId, userId: socket.data.userId, type: 'group-chat-room' });
        });
    };
};

const createGroupChatRoom = (io: any, socket: any) => {
    return async ({ name, userIds }: { name: string, userIds: string[] }) => {
        console.log('SOCKET create-group-chat-room');
        if (!name || !userIds) return socket.emit('error', { message: 'Please provide all fields' });
        const room = new GroupChatRoom({ name, admin: socket.data.userId, users: userIds });
        const savedRoom = await room.save();
        const populatedRoom = await (await savedRoom.populate('users')).populate('admin'); 
        userIds.forEach(userId => io.to(userId).emit('create-group-chat-room', { room: populatedRoom }));
    };
};

const sendGroupChat = (io: any, socket: any) => {
    return async ({ roomId, message }: { roomId: string, message: string }) => {
        console.log('SOCKET send-group-chat');
        if (!roomId || !message) return socket.emit('error', { message: 'Please provide all fields' });
        const groupChatMessage = new GroupChatMessage({ roomId, sender: socket.data.userId, text: message });
        const savedMessage = await groupChatMessage.save();
        const populatedMessage = await savedMessage.populate('sender');
        io.to(`group-chat-room: ${roomId}`).emit('send-group-chat', { roomId, newMessage: populatedMessage });
    };
};

const quitGroupChatRoom = (socket: any) => {
    return ({ roomId }: { roomId: string }) => {
        console.log('SOCKET quit-group-chat-room');
        if (!roomId) return socket.emit('error', { message: 'Please provide room id' });
        socket.leave(`group-chat-room: ${roomId}`);
    };
};

const deleteGroupChatRoom = (io: any, socket: any) => {
    return async ({ roomId }: { roomId: string }) => {
        console.log('SOCKET delete-group-chat-room');
        if (!roomId) return socket.emit('error', { message: 'Please provide room id' });
        const room = await GroupChatRoom.findOne({ roomId });
        if (room && room.admin !== socket.data.userId) return socket.emit('error', { message: 'Only admin is allowed to delete chat' });
        await GroupChatRoom.deleteOne({ _id: roomId });
        await GroupChatMessage.deleteMany({ roomId });
        io.to(`group-chat-room: ${roomId}`).emit('delete-group-chat-room', { roomId });
    };
};

const updateGroupChatRoomGroupPic = (io: any, socket: any) => {
    return async ({ roomId, groupPic }: { roomId: string, groupPic: string }) => {
        console.log('SOCKET update-group-chat-room-group-pic');
        if (!roomId) return socket.emit('error', { message: 'Please provide room id' });
        io.to(`group-chat-room: ${roomId}`).emit('update-group-chat-room-group-pic', { roomId, groupPic });
    };
};

const updateGroupChatRoomWallpaper = (io: any, socket: any) => {
    return async ({ roomId, wallpaper }: { roomId: string, wallpaper: string }) => {
        console.log('SOCKET update-group-chat-room-wallpaper');
        if (!roomId) return socket.emit('error', { message: 'Please provide room id' });
        io.to(`group-chat-room: ${roomId}`).emit('update-group-chat-room-wallpaper', { roomId, wallpaper });
    };
};

export { joinGroupChatRooms, createGroupChatRoom, sendGroupChat, quitGroupChatRoom, deleteGroupChatRoom, updateGroupChatRoomGroupPic, updateGroupChatRoomWallpaper };