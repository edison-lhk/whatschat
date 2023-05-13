import React from 'react';
import { useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatsListScreen from './ChatsListScreen';
import DirectChatRoomScreen from './DirectChatRoomScreen';
import GroupChatRoomScreen from './GroupChatRoomScreen';
import DirectChatRoomDetailsScreen from './DirectChatRoomDetailsScreen';
import GroupChatRoomDetailsScreen from './GroupChatRoomDetailsScreen';

const ChatsStack = createNativeStackNavigator();

const ChatsScreen = () => {
    const { user, socket } = useRoute().params as { user: any, socket: any };

    return (
        <ChatsStack.Navigator screenOptions={{ headerBackTitleVisible: false }}>
            <ChatsStack.Screen name='Chats List' component={ChatsListScreen} initialParams={{ user, socket }} options={{ title: 'WhatsChat', headerShown: true }} />
            <ChatsStack.Screen name='Direct Chat Room' component={DirectChatRoomScreen} initialParams={{ user, socket }} options={{ title: 'WhatsChat', headerShown: false }} />
            <ChatsStack.Screen name='Group Chat Room' component={GroupChatRoomScreen} initialParams={{ user, socket }} options={{ title: 'WhatsChat', headerShown: false }} />
            <ChatsStack.Screen name='Direct Chat Room Details' component={DirectChatRoomDetailsScreen} initialParams={{ user, socket }} options={{ title: 'WhatsChat', headerShown: false }} />
            <ChatsStack.Screen name='Group Chat Room Details' component={GroupChatRoomDetailsScreen} initialParams={{ user, socket }} options={{ title: 'WhatsChat', headerShown: false }} />
        </ChatsStack.Navigator>
    );
};

export default ChatsScreen;