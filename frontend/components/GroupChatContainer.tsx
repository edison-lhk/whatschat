import React, { useRef } from "react";
import { StyleSheet, View, ImageBackground, ScrollView, Pressable } from "react-native";
import GroupChatMessage from "./GroupChatMessage";
import { GroupChatRoomType, GroupChatRoomMessageType } from "../types/app";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const GroupChatContainer = ({ roomId, messages }: { roomId: string, messages: GroupChatRoomMessageType[] }) => {
    const room = useSelector((state: RootState) => state.groupChatRooms).find((room: GroupChatRoomType) => room._id === roomId);
    const scrollViewRef = useRef<ScrollView>(null);

    return (
        <>
            {room && (
                <View style={styles.chatsContainer}>
                    <ImageBackground style={styles.chatBackground} source={room!.wallpaper ? { uri: room!.wallpaper } : require('../assets/chat-background.jpg')}>
                        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.messageList} onContentSizeChange={() => scrollViewRef!.current!.scrollToEnd({ animated: false })} >
                            <Pressable>
                                {messages.map((message: any) => <GroupChatMessage key={message._id} sender={message.sender} text={message.text} createdAt={message.createdAt} /> )}
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

export default GroupChatContainer;