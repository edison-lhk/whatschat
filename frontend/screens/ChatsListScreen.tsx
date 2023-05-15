import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TouchableWithoutFeedback, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import BottomSheet from "@gorhom/bottom-sheet";
import ChatsList from '../components/ChatsList';
import FooterBar from '../components/FooterBar';
import AddRoomMenu from '../components/AddRoomMenu';
import Feather from '@expo/vector-icons/Feather';
import axios from 'axios';
import { BACKEND_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DirectChatRoomMessageType, DirectChatRoomType, GroupChatRoomType, GroupChatRoomMessageType } from '../types/app';
import { Socket } from 'socket.io-client';
import { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { setDirectChatRooms, createDirectChatRoom, deleteDirectChatRoom, updateDirectChatRoomWallpaper, updateDirectChatRoomOnlineStatus, setDirectChatRoomMessages, addDirectChatRoomMessage } from '../redux/features/directChatRoomsSlice';
import { setGroupChatRooms, createGroupChatRoom, deleteGroupChatRoom, updateGroupChatRoomGroupPic, updateGroupChatRoomWallpaper, updateGroupChatRoomOnlineStatus, setGroupChatRoomMessages, addGroupChatRoomMessage } from '../redux/features/groupChatRoomsSlice';

const ChatsListScreen = () => {
    const user = useSelector((state: RootState) => state.user);
    const { socket } = useRoute().params as { socket: Socket };
    const bottomSheetRef = useRef<BottomSheet>(null);
    const dispatch = useDispatch();

    const openMenuHandler = () => {
        if (bottomSheetRef!.current) bottomSheetRef!.current.snapToIndex(0);
        setShowAddRoomMenu(true);
    };
    const closeMenuHandler = () => {
        if (bottomSheetRef!.current) bottomSheetRef!.current!.close();
        setShowAddRoomMenu(false);
    };
    
    const [showAddRoomMenu, setShowAddRoomMenu] = useState<boolean>(false);

    const fetchAllDirectChatRooms = async () => {
        const rooms = await AsyncStorage.getItem('direct-chat-rooms');
        if (rooms) {
            dispatch(setDirectChatRooms(JSON.parse(rooms)));
            socket.emit('join-direct-chat-rooms', { roomIds: JSON.parse(rooms).map((room: any) => room._id) });
        } else {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(`${BACKEND_URL}/api/users/get-direct-chat-rooms/${user._id}`, { headers: { Authorization: 'Bearer ' + JSON.parse(token!) } });
                dispatch(setDirectChatRooms(response.data.rooms));
                socket.emit('join-direct-chat-rooms', { roomIds: response.data.rooms.map((room: any) => room._id) });
                response.data.rooms.forEach((room: DirectChatRoomType) => fetchAllDirectMessages(room._id!));
            } catch(error: any) {
                Alert.alert('Error', error.response.data.error ? error.response.data.error: error.message, [{ text: 'Ok' }]);
            };
        };
    };

    const fetchAllGroupChatRooms = async () => {
        const rooms = await AsyncStorage.getItem('group-chat-rooms');
        if (rooms) {
            dispatch(setGroupChatRooms(JSON.parse(rooms)));
            socket.emit('join-group-chat-rooms', { roomIds: JSON.parse(rooms).map((room: any) => room._id) });
        } else {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(`${BACKEND_URL}/api/users/get-group-chat-rooms/${user._id}`, { headers: { Authorization: 'Bearer ' + JSON.parse(token!) } });
                dispatch(setGroupChatRooms(response.data.rooms));
                socket.emit('join-group-chat-rooms', { roomIds: response.data.rooms.map((room: any) => room._id) });
                response.data.rooms.forEach((room: GroupChatRoomType) => fetchAllGroupMessages(room._id!));
            } catch(error: any) {
                Alert.alert('Error', error.response.data.error ? error.response.data.error: error.message, [{ text: 'Ok' }]);
            };
        };
    };

    const fetchAllDirectMessages = async (roomId: string) => {
        const asyncMessages = await AsyncStorage.getItem(`direct-chat-room/${roomId}`);
        if (!asyncMessages) {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(`${BACKEND_URL}/api/messages/direct-chat/${roomId}`, { headers: { Authorization: 'Bearer ' + JSON.parse(token!) } });
                dispatch(setDirectChatRoomMessages({ roomId, messages: response.data.messages }));
            } catch(error: any) {
                Alert.alert('Error', error.response.data.error ? error.response.data.error: error.message, [{ text: 'Ok' }]);
            };
        };
    };

    const fetchAllGroupMessages = async (roomId: string) => {
        const asyncMessages = await AsyncStorage.getItem(`group-chat-room/${roomId}`);
        if (!asyncMessages) {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(`${BACKEND_URL}/api/messages/group-chat/${roomId}`, { headers: { Authorization: 'Bearer ' + JSON.parse(token!) } });
                dispatch(setGroupChatRoomMessages({ roomId, messages: response.data.messages }));
            } catch(error: any) {
                Alert.alert('Error', error.response.data.error ? error.response.data.error: error.message, [{ text: 'Ok' }]);
            };
        };
    };

    useEffect(() => {
        socket.on('login', () => {
            fetchAllDirectChatRooms();
            fetchAllGroupChatRooms();
        });
        socket.on('error', ({ message }: { message: string }) => {
            Alert.alert('Error', message, [{ text: 'Ok' }]);
        });
        socket.on('create-direct-chat-room', ({ room }: { room: DirectChatRoomType }) => {
            dispatch(createDirectChatRoom(room));
            socket.emit('join-direct-chat-rooms', { roomIds: [room._id] });
        });
        socket.on('create-group-chat-room', ({ room }: { room: GroupChatRoomType }) => {
            dispatch(createGroupChatRoom(room));
            socket.emit('join-group-chat-rooms', { roomIds: [room._id] });
        });
        socket.on('delete-direct-chat-room', ({ roomId }: { roomId: string }) => {
            dispatch(deleteDirectChatRoom(roomId));
            socket.emit('quit-direct-chat-room', { roomId });
        });
        socket.on('delete-group-chat-room', ({ roomId }: { roomId: string }) => {
            dispatch(deleteGroupChatRoom(roomId));
            socket.emit('quit-group-chat-room', { roomId });
        });
        socket.on('send-direct-chat', ({ roomId, newMessage }: { roomId: string, newMessage: DirectChatRoomMessageType }) => {
            dispatch(addDirectChatRoomMessage({ roomId, message: newMessage }));
        });
        socket.on('send-group-chat', ({ roomId, newMessage }: { roomId: string, newMessage: GroupChatRoomMessageType }) => {
            dispatch(addGroupChatRoomMessage({ roomId, message: newMessage }));
        });
        socket.on('update-direct-chat-room-wallpaper', ({ roomId, wallpaper }: { roomId: string, wallpaper: string }) => {
            dispatch(updateDirectChatRoomWallpaper({ roomId, wallpaper }));
        });
        socket.on('update-group-chat-room-group-pic', ({ roomId, groupPic }: { roomId: string, groupPic: string }) => {
            dispatch(updateGroupChatRoomGroupPic({ roomId, groupPic }));
        });
        socket.on('update-group-chat-room-wallpaper', ({ roomId, wallpaper }: { roomId: string, wallpaper: string }) => {
            dispatch(updateGroupChatRoomWallpaper({ roomId, wallpaper }));
        });
        socket.on('online-notification', ({ roomId, userId, type }: { roomId: string, userId: string, type: string }) => {
            if (type === 'direct-chat-room:') {
                dispatch(updateDirectChatRoomOnlineStatus({ roomId, userId, status: true }));
            } else {
                dispatch(updateGroupChatRoomOnlineStatus({ roomId, userId, status: true }));
            }
        });
        socket.on('offline-notification', ({ roomId, userId, type }: { roomId: string, userId: string, type: string }) => {
            if (type === 'direct-chat-room:') {
                dispatch(updateDirectChatRoomOnlineStatus({ roomId, userId, status: false }));
            } else {
                dispatch(updateGroupChatRoomOnlineStatus({ roomId, userId, status: false }));
            }
        });
    }, []);

    useEffect(() => {
        if (showAddRoomMenu) bottomSheetRef!.current!.snapToIndex(0);
    }, [showAddRoomMenu]); 

    return (
        <>  
            <TouchableWithoutFeedback onPress={closeMenuHandler}>
                <SafeAreaView style={styles.screenContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Messages</Text>
                        <TouchableOpacity onPress={openMenuHandler}>
                            <Feather name='edit' size={32} color='#009EDC' />
                        </TouchableOpacity>
                    </View>
                    <ChatsList socket={socket} closeMenuHandler={closeMenuHandler} />
                    <FooterBar />
                </SafeAreaView>
            </TouchableWithoutFeedback>
            {showAddRoomMenu && <AddRoomMenu socket={socket} bottomSheetRef={bottomSheetRef} setShowAddRoomMenu={setShowAddRoomMenu} />}
        </>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 15,
        marginTop: 30
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold'
    }
});

export default ChatsListScreen;