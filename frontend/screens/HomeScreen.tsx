import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { io } from 'socket.io-client';
import { BACKEND_URL } from '@env';
import ChatsScreen from './ChatsScreen';
import SettingScreen from './SettingScreen';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const HomeStack = createNativeStackNavigator();

const HomeScreen = () => {
    const user = useSelector((state: RootState) => state.user);
    const socket = io(BACKEND_URL);
    const navigation = useNavigation();

    useEffect(() => {
        if (user._id) {
            socket.on('connect', () => {
                socket.emit('login', { userId: user._id });
            });
        } else {
            navigation.navigate('Login' as never);
        }
    }, []);

    return ( 
        <HomeStack.Navigator screenOptions={{ animation: 'none', headerBackVisible: false }}>
            <HomeStack.Screen name='Chats' component={ChatsScreen} initialParams={{ socket }} options={{ title: 'WhatsChat', headerShown: false }} />
            <HomeStack.Screen name='Setting' component={SettingScreen} initialParams={{ socket }} options={{ title: 'WhatsChat', headerShown: true }} />
        </HomeStack.Navigator>
    );
};

export default HomeScreen;