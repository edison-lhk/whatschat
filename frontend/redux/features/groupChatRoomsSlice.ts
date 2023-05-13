import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { GroupChatRoomType } from '../../types/app';
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
          const newGroupChatRooms = [ ...state, action.payload ];
          AsyncStorage.setItem('group-chat-rooms', JSON.stringify(newGroupChatRooms));
          return newGroupChatRooms;
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
  },
});

export const { setGroupChatRooms, createGroupChatRoom, deleteGroupChatRoom, updateGroupChatRoomGroupPic, updateGroupChatRoomWallpaper } = groupChatRoomsSlice.actions;

export default groupChatRoomsSlice.reducer;