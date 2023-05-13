import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRoute } from "@react-navigation/native";
import DirectChatRoomHeader from "../components/DirectChatRoomHeader";
import DirectChatContainer from "../components/DirectChatContainer";
import MessageBar from "../components/MessageBar";
import axios from "axios";
import { BACKEND_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DirectChatRoomScreen = () => {
    const { user, socket, room, user2, wallpaperUrl } = useRoute().params as { user: any, socket: any, room: any, user2: any, wallpaperUrl: any };
    const [messages, setMessages] = useState<{ id: number, roomId: number, sender: string, text: string, createdAt: string }[]>([]);

    const fetchAllMessages = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${BACKEND_URL}/api/messages/direct-chat/${room._id}`, { headers: { Authorization: 'Bearer ' + JSON.parse(token!) } });
            setMessages(response.data.messages);
            await AsyncStorage.setItem(`direct-chat-room/${room._id}`, JSON.stringify(response.data.messages));
        } catch(error: any) {
            Alert.alert('Error', error.response.data.error ? error.response.data.error: error.message, [{ text: 'Ok' }]);
        };
    };

    useEffect(() => {
        AsyncStorage.getItem(`direct-chat-room/${room._id}`).then((messages: any) => {
            if (messages) {
                setMessages(JSON.parse(messages));
            } else {
                fetchAllMessages();
            }
        });
        socket.on('error', ({ message }: { message: string }) => {
            Alert.alert('Error', message, [{ text: 'Ok' }]);
        });
        socket.on('send-direct-chat', ({ newMessage }: { newMessage: any }) => {
            setMessages((prevMessages: any) => {
                AsyncStorage.setItem(`direct-chat-room/${room._id}`, JSON.stringify([...prevMessages, newMessage]));
                return [...prevMessages, newMessage];
            });
        });
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.container}>
                <DirectChatRoomHeader roomId={room._id} user2={user2} />
                <DirectChatContainer user={user} wallpaper={room.wallpaper} messages={messages} />
                <MessageBar socket={socket} roomId={room._id} type='direct' />
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