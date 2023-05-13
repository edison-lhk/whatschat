import React from "react";
import { StyleSheet, View, ImageBackground, ScrollView } from "react-native";
import DirectChatMessage from "./DirectChatMessage";
import { DirectChatRoomType, DirectChatRoomMessageType } from "../types/app";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const DirectChatContainer = ({ roomId, messages }: { roomId: string, messages: DirectChatRoomMessageType[] }) => {
    const room = useSelector((state: RootState) => state.directChatRooms).find((room: DirectChatRoomType) => room._id === roomId);

    return (
        <View style={styles.chatsContainer}>
            <ImageBackground style={styles.chatBackground} source={ room!.wallpaper ? { uri: room!.wallpaper } : require('../assets/chat-background.jpg') }>
                <ScrollView contentContainerStyle={styles.messageList}>
                    {messages.map((message: any) => <DirectChatMessage key={message._id} sender={message.sender} text={message.text} createdAt={message.createdAt} /> )}
                </ScrollView>
            </ImageBackground>
        </View>
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
        flex: 1,
        paddingHorizontal: 15,
        justifyContent: 'flex-end',
        paddingBottom: 10
    }
});

export default DirectChatContainer;