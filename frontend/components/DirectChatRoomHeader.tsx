import React from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image, Platform, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { DirectChatRoomType } from "../types/app";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const DirectChatRoomHeader = ({ roomId }: { roomId: string }) => {
    const navigation = useNavigation();
    const room = useSelector((state: RootState) => state.directChatRooms).find((room: DirectChatRoomType) => room._id === roomId);
    const user = useSelector((state: RootState) => state.user);
    const user2 = room?.users![0]._id === user._id ? room?.users![1] : room?.users![0]

    return (
        <>
            {room && (
                <View style={[styles.header, { gap: user2!.profilePic ? 25 : 15 }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={30} color="#009EDC" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.infoContainer, { gap: user2!.profilePic ? 10 : 0 }]} onPress={() => navigation.navigate('Direct Chat Room Details' as never, { roomId } as never)}>
                        <Image style={{ height: user2!.profilePic ? 45 : 100, width: user2!.profilePic ? 45 : 65, top: user2!.profilePic ? 0 : 5, borderRadius: 50}} source={user2!.profilePic ? { uri: user2!.profilePic } : require('../assets/profile-pic.png')} />
                        <View style={styles.textContainer}>
                            <Text style={styles.username}>{ user2!.username }</Text>
                            <Text style={styles.status}>{ user2!.online ? 'Online' : 'Offline' }</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
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
    username: {
        fontWeight: 'bold',
        fontSize: 17
    },
    status: {
        fontSize: 12,
        color: '#999997'
    }
});

export default DirectChatRoomHeader;