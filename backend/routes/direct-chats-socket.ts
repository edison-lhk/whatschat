import { joinDirectChatRooms, createDirectChatRoom, sendDirectChat, quitDirectChatRoom, deleteDirectChatRoom, updateDirectChatRoomWallpaper, readDirectChatRoomMessage } from '../controllers/direct-chats-socket';

const directChatsSocketRouter = (io: any, socket: any) => {
    socket.on('join-direct-chat-rooms', joinDirectChatRooms(socket));
    socket.on('create-direct-chat-room', createDirectChatRoom(io, socket));
    socket.on('send-direct-chat', sendDirectChat(io, socket));
    socket.on('quit-direct-chat-room', quitDirectChatRoom(socket));
    socket.on('delete-direct-chat-room', deleteDirectChatRoom(io, socket));
    socket.on('update-direct-chat-room-wallpaper', updateDirectChatRoomWallpaper(io, socket));
    socket.on('read-direct-chat-room-message', readDirectChatRoomMessage(io, socket));
};

export default directChatsSocketRouter;