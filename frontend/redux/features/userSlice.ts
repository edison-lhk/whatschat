import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserType } from '../../types/app';

let initialUser: UserType = { _id: undefined, username: undefined, email: undefined, profilePic: undefined, bio: undefined, online: undefined };
AsyncStorage.getItem('user').then(value => value ? initialUser = JSON.parse(value) : initialUser = { _id: undefined, username: undefined, email: undefined, profilePic: undefined, bio: undefined, online: undefined }).catch(error => initialUser = { _id: undefined, username: undefined, email: undefined, profilePic: undefined, bio: undefined, online: undefined });

const initialState: UserType = initialUser;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
      setUser: (state, action: PayloadAction<UserType>) => {
          AsyncStorage.setItem('user', JSON.stringify(action.payload));
          return action.payload;
      },
      updateProfilePic: (state, action: PayloadAction<string>) => {
          const newUser = { ...state, profilePic: action.payload };
          AsyncStorage.setItem('user', JSON.stringify(newUser));
          return newUser;
      },
      updateUsername: (state, action: PayloadAction<string>) => {
          const newUser = { ...state, username: action.payload };
          AsyncStorage.setItem('user', JSON.stringify(newUser));
          return newUser;
      },
      updateBio: (state, action: PayloadAction<string>) => {
          const newUser = { ...state, bio: action.payload };
          AsyncStorage.setItem('user', JSON.stringify(newUser));
          return newUser;
      },
      logoutUser: (state) => {
          AsyncStorage.removeItem('user');
          return { _id: undefined, username: undefined, email: undefined, profilePic: undefined, bio: undefined, online: undefined };
      }
  },
})

export const { setUser, updateProfilePic, updateUsername, updateBio, logoutUser } = userSlice.actions;

export default userSlice.reducer;