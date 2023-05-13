import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';
import { io } from 'socket.io-client';
import { BACKEND_URL } from '@env';
import ChatsScreen from './ChatsScreen';
import SettingScreen from './SettingScreen';

const HomeStack = createNativeStackNavigator();

const HomeScreen = () => {
    const { user, setUser } = useRoute().params as { user: { _id: string, username: string, email: string, profilePic: string | undefined, bio: string | undefined }, setUser: any };
    const socket = io(BACKEND_URL);

    useEffect(() => {
        socket.on('connect', () => {
            socket.emit('login', { userId: user._id });
        });
    }, []);

    return ( 
        <HomeStack.Navigator screenOptions={{ animation: 'none', headerBackVisible: false }}>
            <HomeStack.Screen name='Chats' component={ChatsScreen} initialParams={{ user, socket }} options={{ title: 'WhatsChat', headerShown: false }} />
            <HomeStack.Screen name='Setting' component={SettingScreen} initialParams={{ user, socket, setUser }} options={{ title: 'WhatsChat', headerShown: true }} />
        </HomeStack.Navigator>
    );
};

export default HomeScreen;