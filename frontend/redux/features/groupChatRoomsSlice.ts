import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { GroupChatRoomType, GroupChatRoomMessageType } from '../../types/app';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState: GroupChatRoomType[] = [];

export const groupChatRoomsSlice = createSlice({
  name: 'group-chat-rooms',
  initialState,
  reducers: {
      setGroupChatRooms: (state, action: PayloadAction<GroupChatRoomType[]>) => {
          AsyncStorage.setItem('group-chat-rooms', JSON.stringify(action.payload));
          return action.payload;
      },
      createGroupChatRoom: (state, action: PayloadAction<GroupChatRoomType>) => {
        if (state.find(room => room._id === action.payload._id)) {
            return state;
        } else {
            const newGroupChatRooms = [ ...state, { ...action.payload, messages: [] } ];
            AsyncStorage.setItem('group-chat-rooms', JSON.stringify(newGroupChatRooms));
            return newGroupChatRooms;
        }
      },
      deleteGroupChatRoom: (state, action: PayloadAction<string>) => {
          const newGroupChatRooms = state.filter((room: GroupChatRoomType) => room._id !== action.payload);
          AsyncStorage.setItem('group-chat-rooms', JSON.stringify(newGroupChatRooms));
          return newGroupChatRooms;
      },
      updateGroupChatRoomGroupPic: (state: GroupChatRoomType[], action: PayloadAction<{ roomId: string, groupPic: string }>) => {
          const newGroupChatRooms = state.map(room => room._id === action.payload.roomId ? { ...room, groupPic: action.payload.groupPic } : room);
          AsyncStorage.setItem('group-chat-rooms', JSON.stringify(newGroupChatRooms));
          return newGroupChatRooms;
      },
      updateGroupChatRoomWallpaper: (state: GroupChatRoomType[], action: PayloadAction<{ roomId: string, wallpaper: string }>) => {
          const newGroupChatRooms = state.map(room => room._id === action.payload.roomId ? { ...room, wallpaper: action.payload.wallpaper } : room);
          AsyncStorage.setItem('group-chat-rooms', JSON.stringify(newGroupChatRooms));
          return newGroupChatRooms;
      },
      updateGroupChatRoomOnlineStatus: (state: GroupChatRoomType[], action: PayloadAction<{ roomId: string, userId: string, status: boolean }>) => {
          const { roomId, userId, status } = action.payload;
          return state.map(room => {
              if (room._id === roomId) {
                  const users = room.users?.map(user => user._id === userId ? { ...user, online: status } : user);
                  return { ...room, users };
              } else {
                  return room;
              };
          });
      },
      setGroupChatRoomMessages: (state: GroupChatRoomType[], action: PayloadAction<{ roomId: string, messages: GroupChatRoomMessageType[] }>) => {
        const { roomId, messages } = action.payload;
        const newGroupChatRooms = state.map(room => room._id === roomId ? { ...room, messages: messages ? messages : [] } : room);
        AsyncStorage.setItem('group-chat-rooms', JSON.stringify(newGroupChatRooms));
        AsyncStorage.setItem(`group-chat-room/${roomId}`, JSON.stringify(messages));
        return newGroupChatRooms;
    },
    addGroupChatRoomMessage: (state: GroupChatRoomType[], action: PayloadAction<{ roomId: string, message: GroupChatRoomMessageType }>) => {
        const { roomId, message } = action.payload;
        if (state.find(room => room._id === roomId)!.messages?.find(eachMessage => eachMessage._id === message._id)) {
            return state;
        }  else {
            const newGroupChatRooms = state.map(room => room._id === roomId ? { ...room, messages: [...room.messages!, message] as GroupChatRoomMessageType[] } : room);
            const prevMessages = state.find(room => room._id === roomId)?.messages;
            AsyncStorage.setItem('group-chat-rooms', JSON.stringify(newGroupChatRooms));
            AsyncStorage.setItem(`group-chat-room/${roomId}`, JSON.stringify([ ...prevMessages!, message ]));
            return newGroupChatRooms;
        }
    }
  },
});

export const { setGroupChatRooms, createGroupChatRoom, deleteGroupChatRoom, updateGroupChatRoomGroupPic, updateGroupChatRoomWallpaper, updateGroupChatRoomOnlineStatus, setGroupChatRoomMessages, addGroupChatRoomMessage } = groupChatRoomsSlice.actions;

export default groupChatRoomsSlice.reducer;