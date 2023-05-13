import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { DirectChatRoomType } from '../../types/app';
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
          const newDirectChatRooms = [ ...state, action.payload ];
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
      }
  },
});

export const { setDirectChatRooms, createDirectChatRoom, deleteDirectChatRoom, updateDirectChatRoomWallpaper } = directChatRoomsSlice.actions;

export default directChatRoomsSlice.reducer;