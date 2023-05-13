import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRoute } from "@react-navigation/native";
import GroupChatRoomHeader from "../components/GroupChatRoomHeader";
import GroupChatContainer from "../components/GroupChatContainer";
import MessageBar from "../components/MessageBar";
import axios from "axios";
import { BACKEND_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GroupChatRoomType, GroupChatRoomMessageType } from "../types/app";
import { Socket } from "socket.io-client";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const GroupChatRoomScreen = () => {
    const { socket, roomId } = useRoute().params as { socket: Socket, roomId: string };
    const [messages, setMessages] = useState<GroupChatRoomMessageType[]>([]);
    const room = useSelector((state: RootState) => state.groupChatRooms).find((room: GroupChatRoomType) => room._id === roomId);

    const fetchAllMessages = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${BACKEND_URL}/api/messages/group-chat/${room!._id}`, { headers: { Authorization: 'Bearer ' + JSON.parse(token!) } });
            setMessages(response.data.messages);
            await AsyncStorage.setItem(`group-chat-room/${room!._id}`, JSON.stringify(response.data.messages));
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
        socket.on('send-group-chat', ({ newMessage }: { newMessage: GroupChatRoomMessageType }) => {
            setMessages((prevMessages: GroupChatRoomMessageType[]) => {
                AsyncStorage.setItem(`direct-chat-room/${room!._id}`, JSON.stringify([...prevMessages, newMessage]));
                return [...prevMessages, newMessage];
            });
        });
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.container}>
                <GroupChatRoomHeader roomId={room!._id!} />
                <GroupChatContainer roomId={room!._id!} messages={messages} />
                <MessageBar socket={socket} roomId={room!._id!} type='group' />
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

