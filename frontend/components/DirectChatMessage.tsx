import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import moment from 'moment';
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { DirectChatRoomMessageType } from "../types/app";
import { useDispatch } from "react-redux";
import { readDirectChatRoomMessage } from "../redux/features/directChatRoomsSlice";

const DirectChatMessage = ({ roomId, socket, message }: { roomId: string, socket: Socket, message: DirectChatRoomMessageType }) => {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user._id !== message.sender?._id) socket.emit('read-direct-chat-room-message', { roomId, messageId: message._id });
        socket.on('read-direct-chat-room-message', ({ roomId, messageId }: { roomId: string, messageId: string }) => {
            dispatch(readDirectChatRoomMessage({ roomId, messageId }));
        });
    }, []);

    return (
        <View style={[styles.message, { backgroundColor: user._id === message.sender?._id ? '#25D366' : 'white', alignSelf: user._id === message.sender?._id ? 'flex-end' : 'flex-start' }]}>
            <Text style={styles.text}>{ message.text }</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.time}>{ moment(message.createdAt).format("hh:mm a") }</Text>
                {user._id === message.sender?._id && <Text style={{ color: message.read ? '#009EDC' : '#595958' , fontSize: 13 }}>✓</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    message: {
        width: '70%',
        minHeight: 40,
        borderRadius: 12,
        paddingVertical: 5,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5
    },
    text: {
        fontSize: 16,
        width: '70%'
    },
    infoContainer: {
        flexDirection: 'row',
        gap: 3,
        alignItems: 'center'
    },
    time: {
        fontSize: 13,
        color: '#595958'
    }
});

export default DirectChatMessage;