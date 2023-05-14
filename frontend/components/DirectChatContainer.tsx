import React from "react";
import { StyleSheet, View, ImageBackground, ScrollView, Pressable } from "react-native";
import DirectChatMessage from "./DirectChatMessage";
import { DirectChatRoomType, DirectChatRoomMessageType } from "../types/app";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

const DirectChatContainer = ({ roomId, socket, messages }: { roomId: string, socket: Socket, messages: DirectChatRoomMessageType[] }) => {
    const room = useSelector((state: RootState) => state.directChatRooms).find((room: DirectChatRoomType) => room._id === roomId);

    return (
        <>
            {room && (
                <View style={styles.chatsContainer}>
                    <ImageBackground style={styles.chatBackground} source={ room!.wallpaper ? { uri: room!.wallpaper } : require('../assets/chat-background.jpg') }>
                        <ScrollView contentContainerStyle={styles.messageList}>
                            <Pressable>
                                {messages.map((message: any) => <DirectChatMessage key={message._id} roomId={roomId} socket={socket} message={message}  /> )}
                            </Pressable>
                        </ScrollView>
                    </ImageBackground>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    chatsContainer: {
        flex: 1
    },
    chatBackground: {
        width: '100%',
        height: '100%'
    },
    messageList: {
        flexGrow: 1,
        paddingHorizontal: 15,
        justifyContent: 'flex-end',
        paddingBottom: 10,
        paddingVertical: 20
    }
});

export default DirectChatContainer;