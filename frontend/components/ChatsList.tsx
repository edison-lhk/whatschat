import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import DirectChatItem from "./DirectChatItem";
import GroupChatItem from "./GroupChatItem";

const ChatsList = ({ user, socket, directChatRooms, groupChatRooms, closeMenuHandler }: { user: any, socket: any, directChatRooms: any, groupChatRooms: any, closeMenuHandler: () => void }) => {
    return (
        <ScrollView style={styles.listContainer}> 
            {directChatRooms.map((room: any) => <DirectChatItem key={room._id} room={room} socket={socket} user2={room.users[0]._id !== user._id ? room.users[0] : room.users[1] } closeMenuHandler={closeMenuHandler} />)}
            {groupChatRooms.map((room: any) => <GroupChatItem key={room._id} id={room._id} user={user} socket={socket} room={room} closeMenuHandler={closeMenuHandler} />)}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        marginTop: 30
    }
});

export default ChatsList;