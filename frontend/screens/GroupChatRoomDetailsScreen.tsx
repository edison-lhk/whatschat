import React from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text, Platform, StatusBar, SafeAreaView, ScrollView, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

const GroupChatRoomDetailsScreen = () => {
    const navigation = useNavigation();
    const { user, socket, room } = useRoute().params as { user: any, socket: any, room: any };

    const renderDeleteChatRoomModal = () => {
        Alert.alert('Confirmation', 'Are you sure you want to delete chat?', [
            { text: 'No' },
            { text: 'Yes', onPress: deleteChatRoom }
        ]);
    };

    const deleteChatRoom = () => {
        socket.emit('delete-group-chat-room', { roomId: room._id });
        navigation.navigate('Chats List' as never);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={30} color="#009EDC" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Group Info</Text>
            </View>
            <ScrollView contentContainerStyle={styles.infoContainer}>
                <View style={styles.info}>
                    <Image style={styles.groupPic} source={room.groupPic ? room.groupPic : require('../assets/profile-pic.png')} />
                    <View style={styles.textContainer}>
                        <Text style={styles.groupName}>{ room.name }</Text>
                        <Text style={styles.groupText}>Group</Text>
                    </View>
                    <View style={styles.bioContainer}>
                        <Text style={styles.bio}>{ room.bio ? room.bio : 'Available' }</Text>
                    </View>
                </View>
                {room.users.length > 0 && (
                    <View style={styles.participantContainer}>
                        <Text style={styles.participantText}>1 Mutual Groups</Text>
                        <View style={styles.participantList}>
                            {room.users.map((participant: any) => {
                                return participant._id !== user._id ? (
                                    <TouchableOpacity style={styles.participant} onPress={() => navigation.navigate('Direct Chat Room Details' as never, { roomId: room._id, user2: participant } as never)}>
                                        <Image style={styles.participantProfilePic} source={participant.profilePic ? { uri: participant.profilePic } : require('../assets/profile-pic.png')} />
                                        <View style={styles.participantTextContainer}>
                                            <Text style={styles.participantName}>{ participant.username }</Text>
                                            <Text style={styles.participantBio}>{ participant.bio ? participant.bio : 'Available' }</Text>
                                        </View>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={styles.participant}>
                                        <Image style={styles.participantProfilePic} source={participant.profilePic ? participant.profilePic : require('../assets/profile-pic.png')} />
                                        <View style={styles.participantTextContainer}>
                                            <Text style={styles.participantName}>You</Text>
                                            <Text style={styles.participantBio}>{ participant.bio ? participant.bio : 'Available' }</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>
                )}
                {user._id === room.admin && (
                    <TouchableOpacity style={styles.deleteChatBtn} onPress={renderDeleteChatRoomModal}>
                        <Text style={styles.deleteChatBtnText}>Delete Chat</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 65,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    backBtn: {
        left: 20,
        position: 'absolute'
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 17
    },
    infoContainer: {
        marginHorizontal: 20,
        marginTop: 30,
        gap: 30
    },
    info: {
        alignItems: 'center'
    },
    groupPic: {
        width: 300,
        height: 150
    },
    textContainer: {
        alignItems: 'center',
        gap: 5
    },
    groupName: {
        fontWeight: 'bold',
        fontSize: 30
    },
    groupText: {
        color: '#595958',
        fontSize: 17
    },
    bioContainer: {
        backgroundColor: 'white',
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 15,
        justifyContent: 'center',
        marginTop: 30
    },
    bio: {
        fontSize: 18
    },
    participantContainer: {
        gap: 15,
    },
    participantText: {
        fontSize: 19,
        fontWeight: 'bold'
    },
    participantList: {
        backgroundColor: 'white',
        borderRadius: 15
    },
    participant: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        height: 70,
        borderRadius: 15
    },
    participantProfilePic: {
        height: 80,
        width: 65,
        top: 5,
    },
    participantTextContainer: {
        gap: 3,
        justifyContent: 'flex-start'
    },
    participantName: {
        fontWeight: 'bold',
        fontSize: 16
    },
    participantBio: {
        fontSize: 12,
        color: '#999997'
    },
    deleteChatBtn: {
        backgroundColor: 'white',
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 15,
        justifyContent: 'center',
        marginTop: 0
    },
    deleteChatBtnText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#ED4337'
    }
});

export default GroupChatRoomDetailsScreen;