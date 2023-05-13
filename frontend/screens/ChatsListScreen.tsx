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

const ChatsListScreen = () => {
    const { user, socket } = useRoute().params as { user: any, socket: any };
    const bottomSheetRef = useRef<BottomSheet>(null) as any;
    const openMenuHandler = () => {
        if (bottomSheetRef!.current) bottomSheetRef!.current.snapToIndex(0);
        setShowAddRoomMenu(true);
    };
    const closeMenuHandler = () => {
        if (bottomSheetRef!.current) bottomSheetRef!.current!.close();
        setShowAddRoomMenu(false);
    };
    const [directChatRooms, setDirectChatRooms] = useState([]);
    const [groupChatRooms, setGroupChatRooms] = useState([]);
    const [showAddRoomMenu, setShowAddRoomMenu] = useState(false);

    const fetchAllDirectChatRooms = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${BACKEND_URL}/api/users/get-direct-chat-rooms/${user._id}`, { headers: { Authorization: 'Bearer ' + JSON.parse(token!) } });
            setDirectChatRooms(response.data.rooms);
            await AsyncStorage.setItem('direct-chat-rooms', JSON.stringify(response.data.rooms));
            socket.emit('join-direct-chat-rooms', { roomIds: response.data.rooms.map((room: any) => room._id) });
        } catch(error: any) {
            Alert.alert('Error', error.response.data.error ? error.response.data.error: error.message, [{ text: 'Ok' }]);
        };
    };

    const fetchAllGroupChatRooms = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${BACKEND_URL}/api/users/get-group-chat-rooms/${user._id}`, { headers: { Authorization: 'Bearer ' + JSON.parse(token!) } });
            setGroupChatRooms(response.data.rooms);
            await AsyncStorage.setItem('group-chat-rooms', JSON.stringify(response.data.rooms));
            socket.emit('join-group-chat-rooms', { roomIds: response.data.rooms.map((room: any) => room._id) });
        } catch(error: any) {
            Alert.alert('Error', error.response.data.error ? error.response.data.error: error.message, [{ text: 'Ok' }]);
        };
    };

    useEffect(() => {
        AsyncStorage.getItem('direct-chat-rooms').then((rooms: any) => {
            if (rooms) {
                setDirectChatRooms(JSON.parse(rooms));
                socket.emit('join-direct-chat-rooms', { roomIds: rooms.map((room: any) => room._id) });
            } else {
                fetchAllDirectChatRooms();
            };
        });
        AsyncStorage.getItem('group-chat-rooms').then((rooms: any) => {
            if (rooms) {
                setGroupChatRooms(JSON.parse(rooms));
                socket.emit('join-group-chat-rooms', { roomIds: rooms.map((room: any) => room._id) });
            } else {
                fetchAllGroupChatRooms();
            };
        });
        socket.on('error', ({ message }: { message: string }) => {
            Alert.alert('Error', message, [{ text: 'Ok' }]);
        });
        socket.on('create-direct-chat-room', async ({ room }: { room: any }) => {
            setDirectChatRooms((prevRooms: any) => {
                AsyncStorage.setItem('direct-chat-rooms', JSON.stringify([...prevRooms, room]));
                return [...prevRooms, room] as never[];
            });
            socket.emit('join-direct-chat-rooms', { roomIds: [room._id] });
        });
        socket.on('create-group-chat-room', async ({ room }: { room: any }) => {
            setGroupChatRooms((prevRooms: any) => {
                AsyncStorage.setItem('group-chat-rooms', JSON.stringify([...prevRooms, room]));
                return [...prevRooms, room] as never[];
            });
            socket.emit('join-group-chat-rooms', { roomIds: [room._id] });
        });
        socket.on('delete-direct-chat-room', async ({ roomId }: { roomId: string }) => {
            const newDirectChatRooms = directChatRooms.filter((room: any) => room._id !== roomId);
            await AsyncStorage.setItem('direct-chat-rooms' as never, JSON.stringify(newDirectChatRooms));
            setDirectChatRooms(newDirectChatRooms);
            socket.emit('quit-direct-chat-room', { roomId });
        });
        socket.on('delete-group-chat-room', async ({ roomId }: { roomId: string }) => {
            const newGroupChatRooms = groupChatRooms.filter((room: any) => room._id !== roomId);
            await AsyncStorage.setItem('group-chat-rooms' as never, JSON.stringify(newGroupChatRooms));
            setGroupChatRooms(newGroupChatRooms);
            socket.emit('quit-group-chat-room', { roomId });
        });
        socket.on('update-direct-chat-room-wallpaper', async ({ roomId }: { roomId: string }) => {
            fetchAllDirectChatRooms();
        });
        socket.on('update-group-chat-room-group-pic', async ({ roomId }: { roomId: string }) => {
            fetchAllGroupChatRooms();
        });
        socket.on('update-group-chat-room-wallpaper', async ({ roomId }: { roomId: string }) => {
            fetchAllGroupChatRooms();
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
                    <ChatsList user={user} socket={socket} directChatRooms={directChatRooms} groupChatRooms={groupChatRooms} closeMenuHandler={closeMenuHandler} />
                    <FooterBar />
                </SafeAreaView>
            </TouchableWithoutFeedback>
            {showAddRoomMenu && <AddRoomMenu user={user} socket={socket} bottomSheetRef={bottomSheetRef} setDirectChatRooms={setDirectChatRooms} setGroupChatRooms={setGroupChatRooms} setShowAddRoomMenu={setShowAddRoomMenu} />}
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