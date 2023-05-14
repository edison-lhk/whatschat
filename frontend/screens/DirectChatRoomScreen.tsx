import React, { useEffect } from "react";
import { StyleSheet, SafeAreaView, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRoute } from "@react-navigation/native";
import DirectChatRoomHeader from "../components/DirectChatRoomHeader";
import DirectChatContainer from "../components/DirectChatContainer";
import MessageBar from "../components/MessageBar";
import { DirectChatRoomMessageType } from "../types/app";
import { Socket } from "socket.io-client";
import { RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { updateDirectChatRoomWallpaper, addDirectChatRoomMessage } from "../redux/features/directChatRoomsSlice";

const DirectChatRoomScreen = () => {
    const { socket, roomId } = useRoute().params as { socket: Socket, roomId: string };
    const messages = useSelector((state: RootState) => state.directChatRooms.find(room => room._id === roomId)?.messages);
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on('error', ({ message }: { message: string }) => {
            Alert.alert('Error', message, [{ text: 'Ok' }]);
        });
        socket.on('send-direct-chat', ({ roomId, newMessage }: { roomId: string, newMessage: DirectChatRoomMessageType }) => {
            dispatch(addDirectChatRoomMessage({ roomId, message: newMessage }));
        });
        socket.on('update-direct-chat-room-wallpaper', async ({ roomId, wallpaper }: { roomId: string, wallpaper: string }) => {
            dispatch(updateDirectChatRoomWallpaper({ roomId, wallpaper }));
        });
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.container}>
                <DirectChatRoomHeader roomId={roomId} />
                <DirectChatContainer roomId={roomId} socket={socket} messages={messages!} />
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