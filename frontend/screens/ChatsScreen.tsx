import React from 'react';
import { useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatsListScreen from './ChatsListScreen';
import DirectChatRoomScreen from './DirectChatRoomScreen';
import GroupChatRoomScreen from './GroupChatRoomScreen';
import DirectChatRoomDetailsScreen from './DirectChatRoomDetailsScreen';
import GroupChatRoomDetailsScreen from './GroupChatRoomDetailsScreen';
import { Socket } from 'socket.io-client';

const ChatsStack = createNativeStackNavigator();

const ChatsScreen = () => {
    const { socket } = useRoute().params as { socket: Socket };

    return (
        <ChatsStack.Navigator screenOptions={{ headerBackTitleVisible: false }}>
            <ChatsStack.Screen name='Chats List' component={ChatsListScreen} initialParams={{ socket }} options={{ title: 'WhatsChat', headerShown: true }} />
            <ChatsStack.Screen name='Direct Chat Room' component={DirectChatRoomScreen} initialParams={{ socket }} options={{ title: 'WhatsChat', headerShown: false }} />
            <ChatsStack.Screen name='Group Chat Room' component={GroupChatRoomScreen} initialParams={{ socket }} options={{ title: 'WhatsChat', headerShown: false }} />
            <ChatsStack.Screen name='Direct Chat Room Details' component={DirectChatRoomDetailsScreen} initialParams={{ socket }} options={{ title: 'WhatsChat', headerShown: false }} />
            <ChatsStack.Screen name='Group Chat Room Details' component={GroupChatRoomDetailsScreen} initialParams={{ socket }} options={{ title: 'WhatsChat', headerShown: false }} />
        </ChatsStack.Navigator>
    );
};

export default ChatsScreen;