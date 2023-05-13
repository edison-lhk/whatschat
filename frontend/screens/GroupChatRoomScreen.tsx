import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRoute } from "@react-navigation/native";
import GroupChatRoomHeader from "../components/GroupChatRoomHeader";
import GroupChatContainer from "../components/GroupChatContainer";
import MessageBar from "../components/MessageBar";
import axios from "axios";
import { BACKEND_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GroupChatRoomScreen = () => {
    const { user, socket, room } = useRoute().params as { user: any, socket: any, room: any };
    const [messages, setMessages] = useState<{ id: number, roomId: number, sender: string, text: string, createdAt: string }[]>([]);

    const fetchAllMessages = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${BACKEND_URL}/api/messages/group-chat/${room._id}`, { headers: { Authorization: 'Bearer ' + JSON.parse(token!) } });
            setMessages(response.data.messages);
            await AsyncStorage.setItem(`group-chat-room/${room._id}`, JSON.stringify(response.data.messages));
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
        socket.on('send-group-chat', ({ newMessage }: { newMessage: any }) => {
            setMessages((prevMessages: any) => {
                AsyncStorage.setItem(`direct-chat-room/${room._id}`, JSON.stringify([...prevMessages, newMessage]));
                return [...prevMessages, newMessage];
            });
        });
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.container}>
                <GroupChatRoomHeader username={user.username} room={room} />
                <GroupChatContainer user={user} messages={messages} />
                <MessageBar socket={socket} roomId={room._id} type='group' />
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

export default GroupChatRoomScreen;

