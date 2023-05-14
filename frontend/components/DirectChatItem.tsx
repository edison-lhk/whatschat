import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import axios from "axios";
import { BACKEND_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DirectChatRoomType, DirectChatRoomMessageType } from "../types/app";
import { Socket } from "socket.io-client";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const DirectChatItem = ({ id, socket, closeMenuHandler }: { id: string, socket: Socket, closeMenuHandler: () => void }) => {
    const navigation = useNavigation();
    const [latestMessage, setLatestMessage] = useState<any>('');
    const room = useSelector((state: RootState) => state.directChatRooms).find((room: DirectChatRoomType) => room._id === id);
    const user = useSelector((state: RootState) => state.user);
    const user2 = room?.users![0]._id === user._id ? room?.users![1] : room?.users![0]
    const unread = room?.messages?.filter((message: DirectChatRoomMessageType) => !message.read).length;

    const onPress = () => {
        navigation.navigate('Direct Chat Room' as never, { roomId: id } as never);
        closeMenuHandler();
    };

    const fetchLatestMessage = async () => {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${BACKEND_URL}/api/messages/direct-chat/latest/${room!._id}`, { headers: { Authorization: 'Bearer ' + JSON.parse(token!) } });
        setLatestMessage(response.data.message);
    };

    useEffect(() => {
        fetchLatestMessage();
        socket.on('send-direct-chat', async ({ newMessage }: { newMessage: DirectChatRoomMessageType }) => {
            const prevMessages = await AsyncStorage.getItem(`direct-chat-room/${room!._id}`);
            if (prevMessages) await AsyncStorage.setItem(`direct-chat-room/${room!._id}`, JSON.stringify([...JSON.parse(prevMessages), newMessage]));
            setLatestMessage(newMessage);
        });
        socket.on('read-direct-chat-room-message', ({ roomId, messageId }: { roomId: string, messageId: string }) => {
            fetchLatestMessage();
        });
    }, []);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image style={{ width: 65, height: user2!.profilePic ? 65 : 150, borderRadius: 50, padding: 0, top: user2!.profilePic ? -7 : 0 }} source={user2!.profilePic ? { uri: user2!.profilePic } : require('../assets/profile-pic.png')} />
            <View style={styles.infoContainer}>
                <View style={[styles.textContainer]}>
                    <Text style={styles.username} numberOfLines={1}>{ user2!.username }</Text>
                    {latestMessage ? (
                        <View style={styles.messageContainer}>
                            {latestMessage.sender._id === user._id && <Text style={{ color: latestMessage.read ? '#009EDC' : '#999997' , fontSize: 16 }}>✓</Text>}
                            <Text style={styles.message} numberOfLines={1}>{ latestMessage.text }</Text>
                        </View>
                    ) : (
                        <Text style={styles.message} numberOfLines={1}>{ user2!.bio ? user2!.bio : 'Available' }</Text>
                    )}
                </View>
                {latestMessage && (
                    <View style={styles.metadataContainer}>
                        <Text style={styles.time}>{ moment(latestMessage.createdAt).format('hh:mm a') }</Text>
                        { unread! > 0 && (
                            <View style={styles.unreadNumberContainer}>
                                <Text style={styles.unreadNumber}>{ unread }</Text>
                            </View>
                        )}
                    </View>
                )}
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
    username: {
        fontWeight: 'bold',
        fontSize: 19
    },
    messageContainer: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center'
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

export default DirectChatItem;