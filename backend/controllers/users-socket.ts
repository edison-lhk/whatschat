import User from '../models/User';

const loginUser = (socket: any) => {
    return async ({ userId }: { userId: string }) => {
        console.log('SOCKET login');
        socket.data.userId = userId;
        socket.join(userId);
        await User.updateOne({ _id: userId }, { online: true });
        socket.emit('login');
    };
};

const logoutUser = (socket: any) => {
    return async () => {
        console.log('SOCKET disconnect');
    };
};

const offlineNotification = (socket: any) => { 
    return async () => {
        console.log('SOCKET offline-notification');
        const rooms: string[] = Array.from(socket.rooms);
        rooms.forEach((room: string) => {
            if (room.includes('direct-chat-room') || room.includes('group-chat-room')) {
                socket.broadcast.to(room).emit('offline-notification', { roomId: room.split(' ')[1], userId: socket.data.userId, type: room.split(' ')[0] });
            };
        });
        await User.updateOne({ _id: socket.data.userId }, { online: false });
    };
};

export { loginUser, logoutUser, offlineNotification };