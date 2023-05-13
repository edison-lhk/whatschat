import React, { useState } from "react";
import { StyleSheet, View, ImageBackground, ScrollView } from "react-native";
import DirectChatMessage from "./DirectChatMessage";

const DirectChatContainer = ({ user, wallpaper, messages }: { user: any, wallpaper: any, messages: any }) => {
    return (
        <View style={styles.chatsContainer}>
            <ImageBackground style={styles.chatBackground} source={ wallpaper ? { uri: wallpaper } : require('../assets/chat-background.jpg') }>
                <ScrollView contentContainerStyle={styles.messageList}>
                    {messages.map((message: any) => <DirectChatMessage key={message._id} user={user} sender={message.sender} text={message.text} createdAt={message.createdAt} /> )}
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