import React from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image, Platform, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { GroupChatRoomType, UserType } from "../types/app";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const GroupChatRoomHeader = ({ roomId }: { roomId: string }) => {
    const navigation = useNavigation();
    const room = useSelector((state: RootState) => state.groupChatRooms).find((room: GroupChatRoomType) => room._id === roomId);
    const user = useSelector((state: RootState) => state.user);

    const displayParticipants = () => {
        const usernames = room!.users!.map((eachUser: UserType) => {
            if (user.username === eachUser.username) {
                return 'you';
            } else {
                return eachUser.username;
            }
        });
        return usernames.join(', ');
    };

    return (
        <View style={[styles.header, { gap: room!.groupPic ? 25 : 15 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={30} color="#009EDC" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.infoContainer, { gap: room!.groupPic ? 10 : 0 }]} onPress={() => navigation.navigate('Group Chat Room Details' as never, { roomId } as never)}>
                <Image style={{ height: room!.groupPic ? 45 : 100, width: room!.groupPic ? 45 : 65, top: room!.groupPic ? 0 : 5, borderRadius: 50}} source={room!.groupPic ? { uri: room!.groupPic } : require('../assets/profile-pic.png')} />
                <View style={styles.textContainer}>
                    <Text style={styles.groupName}>{ room!.name }</Text>
                    <Text style={styles.participants} numberOfLines={1}>{displayParticipants()}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        height: 65,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        height: '100%',
    },
    textContainer: {
        gap: 3,
        justifyContent: 'flex-start'
    },
    groupName: {
        fontWeight: 'bold',
        fontSize: 17
    },
    participants: {
        fontSize: 12,
        color: '#999997'
    }
});

export default GroupChatRoomHeader;