import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import axios from "axios";
import { BACKEND_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GroupChatRoomMessageType, GroupChatRoomType, UserType } from "../types/app";
import { Socket } from "socket.io-client";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const GroupChatItem = ({ id, socket, closeMenuHandler }: { id: string, socket: Socket, closeMenuHandler: () => void }) => {
    const navigation = useNavigation();
    const [latestMessage, setLatestMessage] = useState<string>('');
    const [latestMessageTime, setLatestMessageTime] = useState<string>('');
    const room = useSelector((state: RootState) => state.groupChatRooms).find((room: GroupChatRoomType) => room._id === id);
    const user = useSelector((state: RootState) => state.user);

    const onPress = () => {
        navigation.navigate('Group Chat Room' as never, { roomId: id } as never);
        closeMenuHandler();
    };

    const fetchLatestMessage = async () => {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${BACKEND_URL}/api/messages/group-chat/latest/${id}`, { headers: { Authorization: 'Bearer ' + JSON.parse(token!) } });
        setLatestMessage(formatLatestMessage(response.data.message));
        setLatestMessageTime(moment(response.data.message.createdAt).format('hh:mm a'));
    };

    const formatLatestMessage = (message: GroupChatRoomMessageType) => {
        if (message!.sender!.username === user.username) {
            return `you: ${message.text}`;
        } else {
            return `${message!.sender!.username}: ${message.text}`;
        };
    };

    const displayParticipants = () => {
        const usernames = room!.users!.map((eachUser: UserType) => {
            if (user.username === eachUser.username) {
                return 'you';
            } else {
                return eachUser.username;
            }
        });
        return usernames.join(', ');
    };

    useEffect(() => {
        fetchLatestMessage();
        socket.on('send-group-chat', async ({ newMessage }: { newMessage: GroupChatRoomMessageType }) => {
            const prevMessages = await AsyncStorage.getItem(`group-chat-room/${id}`);
            if (prevMessages) await AsyncStorage.setItem(`group-chat-room/${id}`, JSON.stringify([...JSON.parse(prevMessages), newMessage]));
            setLatestMessage(newMessage!.text!);
            setLatestMessageTime(moment(newMessage.createdAt).format('hh:mm a'));
        });
    }, []);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image style={{ width: 65, height: room!.groupPic ? 65 : 150, borderRadius: 50, padding: 0, top: room!.groupPic ? -7 : 0 }} source={room!.groupPic ? { uri: room!.groupPic } : require('../assets/profile-pic.png')} />
            <View style={styles.infoContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.groupName} numberOfLines={1}>{ room!.name }</Text>
                    <Text style={styles.message} numberOfLines={1} >{ latestMessage ? latestMessage : displayParticipants() }</Text>
                </View>
                <View style={styles.metadataContainer}>
                    <Text style={styles.time}>{ latestMessageTime }</Text>
                    {room?.messages?.length! > 0 && (
                        <View style={styles.unreadNumberContainer}>
                            <Text style={styles.unreadNumber}>{ room?.messages?.length }</Text>
                        </View>
                    )}
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
        gap: 7,
        width: '80%',
        justifyContent: 'flex-start'
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