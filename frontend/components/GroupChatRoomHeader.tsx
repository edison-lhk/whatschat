import React from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image, Platform, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

const GroupChatRoomHeader = ({ username, room }: { username: string, room: any }) => {
    const navigation = useNavigation();

    const displayParticipants = () => {
        const usernames = room.users.map((user: any) => {
            if (user.username === username) {
                return 'you';
            } else {
                return user.username;
            }
        });
        return usernames.join(', ');
    };

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={30} color="#009EDC" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoContainer} onPress={() => navigation.navigate('Group Chat Room Details' as never, { room } as never)}>
                <Image style={styles.profilePic} source={room.groupPic ? room.groupPic : require('../assets/profile-pic.png')} />
                <View style={styles.textContainer}>
                    <Text style={styles.groupName}>{ room.name }</Text>
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
    profilePic: {
        height: 100,
        width: 65,
        top: 5
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