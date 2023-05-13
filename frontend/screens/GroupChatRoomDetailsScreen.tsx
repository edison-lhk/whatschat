import React from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text, Platform, StatusBar, SafeAreaView, ScrollView, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { GroupChatRoomType } from "../types/app";
import { Socket } from "socket.io-client";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BACKEND_URL } from "@env";
import { RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { updateGroupChatRoomGroupPic, updateGroupChatRoomWallpaper } from "../redux/features/groupChatRoomsSlice";

const GroupChatRoomDetailsScreen = () => {
    const navigation = useNavigation();
    const { socket, roomId } = useRoute().params as { socket: Socket, roomId: string };
    const room = useSelector((state: RootState) => state.groupChatRooms).find((room: GroupChatRoomType) => room._id === roomId);
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    const renderDeleteChatRoomModal = () => {
        Alert.alert('Confirmation', 'Are you sure you want to delete chat?', [
            { text: 'No' },
            { text: 'Yes', onPress: deleteChatRoom }
        ]);
    };

    const deleteChatRoom = () => {
        socket.emit('delete-group-chat-room', { roomId: room!._id });
        navigation.navigate('Chats List' as never);
    };

    const editGroupPic = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Info", "Permission to access camera roll is required!", [{ text: 'Ok' }]);
            return;
        };
        const image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
        if (!image.canceled) {
            const uri = image.assets[0].uri;
            const filename = image.assets[0].uri.split('/').pop() as string;
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;
            const name = `${room!._id}-group-pic.` + filename.split('.').pop(); 
            const formData = new FormData();
            formData.append('group-pic', { uri, name, type } as unknown as File);
            const token = await AsyncStorage.getItem('token');
            try {
                const response = await axios.patch(`${BACKEND_URL}/api/group-chats/update-group-pic/${room!._id}`, formData, { headers: { Authorization: 'Bearer ' + JSON.parse(token as string), "Content-Type": 'multipart/form-data' } });
                socket.emit('update-group-chat-room-group-pic', { roomId: room!._id, groupPic: response.data.groupPic });
                dispatch(updateGroupChatRoomGroupPic({ roomId: room!._id!, groupPic: response.data.groupPic }));
                navigation.navigate('Group Chat Room' as never, { roomId: room?._id } as never);
            } catch(error: any) {
                Alert.alert('Error', error.response.data.error ? error.response.data.error : error.message, [{ text: 'Ok' }]);
            };
        };
    };

    const editWallpaper = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Info", "Permission to access camera roll is required!", [{ text: 'Ok' }]);
            return;
        };
        const image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
        if (!image.canceled) {
            const uri = image.assets[0].uri;
            const filename = image.assets[0].uri.split('/').pop() as string;
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;
            const name = `${room!._id}-wallpaper.` + filename.split('.').pop(); 
            const formData = new FormData();
            formData.append('wallpaper', { uri, name, type } as unknown as File);
            const token = await AsyncStorage.getItem('token');
            try {
                const response = await axios.patch(`${BACKEND_URL}/api/group-chats/update-wallpaper/${room!._id}`, formData, { headers: { Authorization: 'Bearer ' + JSON.parse(token as string), "Content-Type": 'multipart/form-data' } });
                socket.emit('update-group-chat-room-wallpaper', { roomId: room!._id, wallpaper: response.data.wallpaper });
                dispatch(updateGroupChatRoomWallpaper({ roomId: room!._id!, wallpaper: response.data.wallpaper }));
                navigation.navigate('Group Chat Room' as never, { roomId: room?._id } as never);
            } catch(error: any) {
                Alert.alert('Error', error.response.data.error ? error.response.data.error : error.message, [{ text: 'Ok' }]);
            }
        };
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
                    <Image style={{ width: room!.groupPic ? 130 : 300, height: room!.groupPic ? 130 : 150, borderRadius: 130 / 2 }} source={room!.groupPic ? { uri: room!.groupPic } : require('../assets/profile-pic.png')} />
                    <View style={[styles.textContainer, { marginTop: room!.groupPic ? 40 : 15 }]}>
                        <TouchableOpacity style={styles.updateGroupPicBtn} onPress={editGroupPic}>
                            <Text style={styles.updateGroupPicBtnText}>Edit</Text>
                        </TouchableOpacity>
                        <Text style={styles.groupName}>{ room!.name }</Text>
                        <Text style={styles.groupText}>Group</Text>
                    </View>
                    <View style={styles.bioContainer}>
                        <Text style={styles.bio}>{ room!.bio ? room!.bio : 'Available' }</Text>
                    </View>
                    <TouchableOpacity style={styles.updateWallpaperBtn} onPress={editWallpaper}>
                        <Text style={styles.updateWallpaperBtnText}>Edit Wallpaper</Text>
                    </TouchableOpacity>
                </View>
                {room!.users!.length > 0 && (
                    <View style={[styles.participantContainer, { marginBottom: user._id === room!.admin!._id ? 0 : 80 }]}>
                        <Text style={styles.participantText}>1 Mutual Groups</Text>
                        <View style={styles.participantList}>
                            {room!.users!.map((participant: any) => {
                                return participant._id !== user._id ? (
                                    <TouchableOpacity style={[styles.participant, { paddingHorizontal: participant.profilePic ? 30 : 15, gap: participant.profilePic ? 20 : 5 }]}>
                                        <Image style={{ height: participant.profilePic ? 35 : 80, width: participant.profilePic ? 35 : 65, borderRadius: 35 / 2, top: 5 }} source={participant.profilePic ? { uri: participant.profilePic } : require('../assets/profile-pic.png')} />
                                        <View style={styles.participantTextContainer}>
                                            <Text style={styles.participantName}>{ participant.username }</Text>
                                            <Text style={styles.participantBio}>{ participant.bio ? participant.bio : 'Available' }</Text>
                                        </View>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={[styles.participant, { paddingHorizontal: participant.profilePic ? 30 : 15, gap: participant.profilePic ? 20 : 5 }]}>
                                        <Image style={{ height: participant.profilePic ? 35 : 80, width: participant.profilePic ? 35 : 65, borderRadius: 35 / 2, top: 5 }} source={participant.profilePic ? { uri: participant.profilePic } : require('../assets/profile-pic.png')} />
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
                {user._id === room!.admin!._id && (
                    <TouchableOpacity style={[styles.deleteChatBtn, { marginBottom: 80 }]} onPress={renderDeleteChatRoomModal}>
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
    textContainer: {
        alignItems: 'center',
        gap: 5
    },
    updateGroupPicBtn: {
        position: 'absolute',
        top: -25
    },
    updateGroupPicBtnText: {
        fontSize: 16,
        color: '#009EDC',
        fontWeight: 'bold'
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
    updateWallpaperBtn: {
        backgroundColor: 'white',
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    updateWallpaperBtnText: {
        fontSize: 16,
        color: '#009EDC',
        fontWeight: 'bold'
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
        alignItems: 'center',
        paddingVertical: 10,
        height: 70,
        borderRadius: 15
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