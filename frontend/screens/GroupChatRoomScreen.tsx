import React, { useEffect } from "react";
import { StyleSheet, SafeAreaView, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useRoute } from "@react-navigation/native";
import GroupChatRoomHeader from "../components/GroupChatRoomHeader";
import GroupChatContainer from "../components/GroupChatContainer";
import MessageBar from "../components/MessageBar";
import { GroupChatRoomMessageType } from "../types/app";
import { Socket } from "socket.io-client";
import { RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { updateGroupChatRoomWallpaper, updateGroupChatRoomGroupPic, addGroupChatRoomMessage } from "../redux/features/groupChatRoomsSlice";

const GroupChatRoomScreen = () => {
    const { socket, roomId } = useRoute().params as { socket: Socket, roomId: string };
    const messages = useSelector((state: RootState) => state.groupChatRooms.find(room => room._id === roomId)?.messages);
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on('error', ({ message }: { message: string }) => {
            Alert.alert('Error', message, [{ text: 'Ok' }]);
        });
        socket.on('send-group-chat', ({ roomId, newMessage }: { roomId: string, newMessage: GroupChatRoomMessageType }) => {
            dispatch(addGroupChatRoomMessage({ roomId, message: newMessage }));
        });
        socket.on('update-group-chat-room-group-pic', async ({ roomId, groupPic }: { roomId: string, groupPic: string }) => {
            dispatch(updateGroupChatRoomGroupPic({ roomId, groupPic }));
        });
        socket.on('update-group-chat-room-wallpaper', async ({ roomId, wallpaper }: { roomId: string, wallpaper: string }) => {
            dispatch(updateGroupChatRoomWallpaper({ roomId, wallpaper }));
        });
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.container}>
                <GroupChatRoomHeader roomId={roomId} />
                <GroupChatContainer roomId={roomId} messages={messages!} />
                <MessageBar socket={socket} roomId={roomId} type='group' />
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

