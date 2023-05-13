import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRoute } from "@react-navigation/native";
import DirectChatRoomHeader from "../components/DirectChatRoomHeader";
import DirectChatContainer from "../components/DirectChatContainer";
import MessageBar from "../components/MessageBar";
import axios from "axios";
import { BACKEND_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DirectChatRoomType, DirectChatRoomMessageType } from "../types/app";
import { Socket } from "socket.io-client";
import { RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { updateDirectChatRoomWallpaper } from "../redux/features/directChatRoomsSlice";

const DirectChatRoomScreen = () => {
    const { socket, roomId } = useRoute().params as { socket: Socket, roomId: string };
    const [messages, setMessages] = useState<DirectChatRoomMessageType[]>([]);
    const room = useSelector((state: RootState) => state.directChatRooms).find((room: DirectChatRoomType) => room._id === roomId);
    const dispatch = useDispatch();

    const fetchAllMessages = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${BACKEND_URL}/api/messages/direct-chat/${room!._id}`, { headers: { Authorization: 'Bearer ' + JSON.parse(token!) } });
            setMessages(response.data.messages);
            await AsyncStorage.setItem(`direct-chat-room/${room!._id}`, JSON.stringify(response.data.messages));
        } catch(error: any) {
            Alert.alert('Error', error.response.data.error ? error.response.data.error: error.message, [{ text: 'Ok' }]);
        };
    };

    useEffect(() => {
        AsyncStorage.getItem(`direct-chat-room/${room!._id}`).then((messages: string | null) => {
            if (messages) {
                setMessages(JSON.parse(messages));
            } else {
                fetchAllMessages();
            }
        });
        socket.on('error', ({ message }: { message: string }) => {
            Alert.alert('Error', message, [{ text: 'Ok' }]);
        });
        socket.on('send-direct-chat', ({ newMessage }: { newMessage: DirectChatRoomMessageType }) => {
            setMessages((prevMessages: any) => {
                AsyncStorage.setItem(`direct-chat-room/${room!._id}`, JSON.stringify([...prevMessages, newMessage]));
                return [...prevMessages, newMessage];
            });
        });
        socket.on('update-direct-chat-room-wallpaper', async ({ roomId, wallpaper }: { roomId: string, wallpaper: string }) => {
            dispatch(updateDirectChatRoomWallpaper({ roomId, wallpaper }));
        });
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.container}>
                <DirectChatRoomHeader roomId={roomId} />
                <DirectChatContainer roomId={roomId} messages={messages} />
                <MessageBar socket={socket} roomId={roomId} type='direct' />
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});

export default DirectChatRoomScreen;