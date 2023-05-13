import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/userSlice';
import directChatRoomsSlice from './features/directChatRoomsSlice';
import groupChatRoomsSlice from './features/groupChatRoomsSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    directChatRooms: directChatRoomsSlice,
    groupChatRooms: groupChatRoomsSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;