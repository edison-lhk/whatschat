import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import axios from "axios";
import { BACKEND_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GroupChatItem = ({ id, user, socket, room, closeMenuHandler }: { id: string, user: any, socket: any, room: any, closeMenuHandler: () => void }) => {
    const navigation = useNavigation();
    const [latestMessage, setLatestMessage] = useState('');
    const [latestMessageTime, setLatestMessageTime] = useState('');

    const onPress = () => {
        navigation.navigate('Group Chat Room' as never, { room } as never);
        closeMenuHandler();
    };

    const fetchLatestMessage = async () => {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${BACKEND_URL}/api/messages/group-chat/latest/${id}`, { headers: { Authorization: 'Bearer ' + JSON.parse(token!) } });
        setLatestMessage(formatLatestMessage(response.data.message));
        setLatestMessageTime(moment(response.data.message.createdAt).format('hh:mm a'));
    };

    const formatLatestMessage = (message: any) => {
        if (message.sender.username === user.username) {
            return `you: ${message.text}`;
        } else {
            return `${message.sender.username}: ${message.text}`;
        };
    };

    useEffect(() => {
        fetchLatestMessage();
        socket.on('send-group-chat', async ({ newMessage }: { newMessage: any }) => {
            const prevMessages = await AsyncStorage.getItem(`group-chat-room/${id}`);
            if (prevMessages) await AsyncStorage.setItem(`group-chat-room/${id}`, JSON.stringify([...JSON.parse(prevMessages), newMessage]));
            setLatestMessage(newMessage.text);
            setLatestMessageTime(moment(newMessage.createdAt).format('hh:mm a'));
        });
    }, []);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image style={styles.groupPic} source={room.groupPic ? room.groupPic : require('../assets/profile-pic.png')} />
            <View style={styles.infoContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.groupName} numberOfLines={1}>{ room.name }</Text>
                    <Text style={styles.message} numberOfLines={1} >{ latestMessage }</Text>
                </View>
                <View style={styles.metadataContainer}>
                    <Text style={styles.time}>{ latestMessageTime }</Text>
                    <View style={styles.unreadNumberContainer}>
                        <Text style={styles.unreadNumber}>324</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 90,
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#BFBFBD',
        borderBottomWidth: 1,
        borderBottomColor: '#BFBFBD',
        paddingTop: 10,
        gap: 20
    },
    groupPic: {
        width: 65,
        height: 150,
        borderRadius: 50,
        padding: 0
    },
    infoContainer: {
        width: '73%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textContainer: {
        justifyContent: 'flex-start',
        gap: 7,
        width: '80%'
    },
    groupName: {
        fontWeight: 'bold',
        fontSize: 19
    },
    message: {
        color: '#999997',
        fontSize: 16
    },
    metadataContainer: {
        gap: 7,
        alignItems: 'flex-end'
    },
    time: {
        color: '#999997'
    },
    unreadNumberContainer: {
        backgroundColor: '#009EDC',
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 50
    },
    unreadNumber: {
        color: 'white',
    }
});

export default GroupChatItem;