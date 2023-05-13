import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import DirectChatItem from "./DirectChatItem";
import GroupChatItem from "./GroupChatItem";
import { UserType, DirectChatRoomType, GroupChatRoomType } from "../types/app";
import { Socket } from "socket.io-client";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
 
const ChatsList = ({ socket, closeMenuHandler }: { socket: Socket, closeMenuHandler: () => void }) => {
    const { directChatRooms, groupChatRooms } = useSelector((state: RootState) => state);

    return (
        <ScrollView style={styles.listContainer}> 
            {directChatRooms.map((room: DirectChatRoomType) => <DirectChatItem key={room._id} id={room._id!} socket={socket} closeMenuHandler={closeMenuHandler} />)}
            {groupChatRooms.map((room: GroupChatRoomType) => <GroupChatItem key={room._id} id={room._id!} socket={socket} closeMenuHandler={closeMenuHandler} />)}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        marginTop: 30
    }
});

export default ChatsList;