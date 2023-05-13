import { joinGroupChatRooms, createGroupChatRoom, sendGroupChat, quitGroupChatRoom, deleteGroupChatRoom, updateGroupChatRoomGroupPic, updateGroupChatRoomWallpaper } from '../controllers/group-chats-socket';

const groupChatsSocketRouter = (io: any, socket: any) => {
    socket.on('join-group-chat-rooms', joinGroupChatRooms(socket));
    socket.on('create-group-chat-room', createGroupChatRoom(io, socket));
    socket.on('send-group-chat', sendGroupChat(io, socket));
    socket.on('quit-group-chat-room', quitGroupChatRoom(socket));
    socket.on('delete-group-chat-room', deleteGroupChatRoom(io, socket));
    socket.on('update-group-chat-room-group-pic', updateGroupChatRoomGroupPic(io, socket));
    socket.on('update-group-chat-room-wallpaper', updateGroupChatRoomWallpaper(io, socket));
};

export default groupChatsSocketRouter;