import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { DirectChatRoomMessageType, DirectChatRoomType } from '../../types/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState: DirectChatRoomType[] = [];

export const directChatRoomsSlice = createSlice({
    name: 'direct-chat-rooms',
    initialState,
    reducers: {
        setDirectChatRooms: (state, action: PayloadAction<DirectChatRoomType[]>) => {
            AsyncStorage.setItem('direct-chat-rooms', JSON.stringify(action.payload));
            return action.payload;
        },
        createDirectChatRoom: (state, action: PayloadAction<DirectChatRoomType>) => {
            const newDirectChatRooms = [ ...state, { ...action.payload, messages: [] } ];
            AsyncStorage.setItem('direct-chat-rooms', JSON.stringify(newDirectChatRooms));
            return newDirectChatRooms;
        },
        deleteDirectChatRoom: (state, action: PayloadAction<string>) => {
            const newDirectChatRooms = state.filter((room: DirectChatRoomType) => room._id !== action.payload);
            AsyncStorage.setItem('direct-chat-rooms', JSON.stringify(newDirectChatRooms));
            return newDirectChatRooms;
        },
        updateDirectChatRoomWallpaper: (state: DirectChatRoomType[], action: PayloadAction<{ roomId: string, wallpaper: string }>) => {
            const newDirectChatRooms = state.map(room => room._id === action.payload.roomId ? { ...room, wallpaper: action.payload.wallpaper } : room);
            AsyncStorage.setItem('direct-chat-rooms', JSON.stringify(newDirectChatRooms));
            return newDirectChatRooms;
        },
        updateDirectChatRoomOnlineStatus: (state: DirectChatRoomType[], action: PayloadAction<{ roomId: string, userId: string, status: boolean }>) => {
            const { roomId, userId, status } = action.payload;
            const newDirectChatRooms = state.map(room => {
                if (room._id === roomId) {
                    const users = room.users?.map(user => user._id === userId ? { ...user, online: status } : user);
                    return { ...room, users };
                } else {
                    return room;
                };
            });
            AsyncStorage.setItem('direct-chat-rooms', JSON.stringify(newDirectChatRooms));
            return newDirectChatRooms;
        },
        setDirectChatRoomMessages: (state: DirectChatRoomType[], action: PayloadAction<{ roomId: string, messages: DirectChatRoomMessageType[] }>) => {
            const { roomId, messages } = action.payload;
            const newDirectChatRooms = state.map(room => room._id === roomId ? { ...room, messages: messages ? messages : [] } : room);
            AsyncStorage.setItem('direct-chat-rooms', JSON.stringify(newDirectChatRooms));
            AsyncStorage.setItem(`direct-chat-room/${roomId}`, JSON.stringify(messages));
            return newDirectChatRooms;
        },
        addDirectChatRoomMessage: (state: DirectChatRoomType[], action: PayloadAction<{ roomId: string, message: DirectChatRoomMessageType }>) => {
            const { roomId, message } = action.payload;
            const newDirectChatRooms = state.map(room => room._id === roomId ? { ...room, messages: [...room.messages!, message] as DirectChatRoomMessageType[] } : room);
            const prevMessages = state.find(room => room._id === roomId)?.messages;
            AsyncStorage.setItem('direct-chat-rooms', JSON.stringify(newDirectChatRooms));
            AsyncStorage.setItem(`direct-chat-room/${roomId}`, JSON.stringify([ ...prevMessages!, message ]));
            return newDirectChatRooms;
        },
        readDirectChatRoomMessage: (state: DirectChatRoomType[], action: PayloadAction<{ roomId: string, messageId: string }>) => {
            const { roomId, messageId } = action.payload;
            const newDirectChatRooms = state.map(room => room._id === roomId ? { ...room, messages: room.messages?.map(message => message._id === messageId ? { ...message, read: true } : message) } : room);
            AsyncStorage.setItem('direct-chat-rooms', JSON.stringify(newDirectChatRooms));
            const targetMessages = newDirectChatRooms.find(room => room._id === roomId)?.messages;
            AsyncStorage.setItem(`direct-chat-room/${roomId}`, JSON.stringify(targetMessages));
            return newDirectChatRooms;
        }
    },
});

export const { setDirectChatRooms, createDirectChatRoom, deleteDirectChatRoom, updateDirectChatRoomWallpaper, updateDirectChatRoomOnlineStatus, setDirectChatRoomMessages, addDirectChatRoomMessage, readDirectChatRoomMessage } = directChatRoomsSlice.actions;

export default directChatRoomsSlice.reducer;