import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text, Platform, StatusBar, SafeAreaView, ScrollView, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import { BACKEND_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';

const DirectChatRoomDetailsScreen = () => {
    const navigation = useNavigation();
    const { user, socket, roomId, user2 } = useRoute().params as { user: any, socket: any, roomId: string, user2: any };
    const [mutualGroups, setMutualGroups] = useState([]);

    const fetchMutualGroups = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${BACKEND_URL}/api/users/get-mutual-groups/${user._id}&${user2._id}`, { headers: { Authorization: 'Bearer ' + JSON.parse(token!) } });
            setMutualGroups(response.data.rooms);
        } catch(error: any) {
            Alert.alert('Error', error.message, [{ text: 'Ok' }]);
        }
    };

    const displayParticipants = (mutualGroup: any) => {
        const usernames = mutualGroup.users.map((participant: any) => {
            if (participant.username === user.username) {
                return 'you';
            } else {
                return participant.username;
            }
        });
        return usernames.join(', ');
    };

    const renderDeleteChatRoomModal = () => {
        Alert.alert('Confirmation', 'Are you sure you want to delete chat?', [
            { text: 'No' },
            { text: 'Yes', onPress: deleteChatRoom }
        ]);
    };

    const deleteChatRoom = () => {
        socket.emit('delete-direct-chat-room', { roomId });
        navigation.navigate('Chats List' as never);
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
            const name = `${roomId}-wallpaper.` + filename.split('.').pop(); 
            const formData = new FormData();
            formData.append('wallpaper', { uri, name, type } as unknown as File);
            const token = await AsyncStorage.getItem('token');
            try {
                await axios.patch(`${BACKEND_URL}/api/direct-chats/update-wallpaper/${roomId}`, formData, { headers: { Authorization: 'Bearer ' + JSON.parse(token as string), "Content-Type": 'multipart/form-data' } });
                socket.emit('update-direct-chat-room-wallpaper', { roomId });
                navigation.navigate('Chats List' as never);
            } catch(error: any) {
                Alert.alert('Error', error.response.data.error ? error.response.data.error : error.message, [{ text: 'Ok' }]);
            }
        };
    };

    useEffect(() => {
        fetchMutualGroups();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={30} color="#009EDC" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Contact Info</Text>
            </View>
            <ScrollView contentContainerStyle={styles.infoContainer}>
                <View style={styles.info}>
                    <Image style={{ width: user2.profilePic ? 130 : 300, height: user2.profilePic ? 130 : 150, borderRadius: 130 / 2 }} source={user2.profilePic ? { uri: user2.profilePic } : require('../assets/profile-pic.png')} />
                    <View style={[styles.textContainer, { marginTop: user2.profilePic ? 25 : 0 }]}>
                        <Text style={styles.username}>{ user2.username }</Text>
                        <Text style={styles.email}>{ user2.email }</Text>
                    </View>
                    <View style={styles.bioContainer}>
                        <Text style={styles.bio}>{ user2.bio ? user2.bio : 'Available' }</Text>
                    </View>
                    <TouchableOpacity style={styles.updateWallpaperBtn} onPress={editWallpaper}>
                        <Text style={styles.updateWallpaperBtnText}>Edit Wallpaper</Text>
                    </TouchableOpacity>
                </View>
                {mutualGroups.length > 0 && (
                    <View style={styles.mutualGroupContainer}>
                        <Text style={styles.mutualGroupText}>1 Mutual Groups</Text>
                        <View style={styles.mutualGroupList}>
                            {mutualGroups.map((mutualGroup: any) => (
                                <TouchableOpacity style={styles.mutualGroup} onPress={() => navigation.navigate('Group Chat Room' as never, { room: mutualGroup } as never)}>
                                    <Image style={styles.mutualGroupProfilePic} source={mutualGroup.groupPic ? mutualGroup.groupPic : require('../assets/profile-pic.png')} />
                                    <View style={styles.mutualGroupTextContainer}>
                                        <Text style={styles.mutualGroupName}>{ mutualGroup.name }</Text>
                                        <Text style={styles.mutualGroupParticipants}>{ displayParticipants(mutualGroup) }</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
                <TouchableOpacity style={styles.deleteChatBtn} onPress={renderDeleteChatRoomModal}>
                    <Text style={styles.deleteChatBtnText}>Delete Chat</Text>
                </TouchableOpacity>
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
    username: {
        fontWeight: 'bold',
        fontSize: 30
    },
    email: {
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
        color: '#009EDC'
    },
    mutualGroupContainer: {
        gap: 15,
    },
    mutualGroupText: {
        fontSize: 19,
        fontWeight: 'bold'
    },
    mutualGroupList: {
        backgroundColor: 'white',
        borderRadius: 15
    },
    mutualGroup: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        height: 70,
        borderRadius: 15
    },
    mutualGroupProfilePic: {
        height: 80,
        width: 65,
        top: 5,
    },
    mutualGroupTextContainer: {
        gap: 3,
        justifyContent: 'flex-start'
    },
    mutualGroupName: {
        fontWeight: 'bold',
        fontSize: 16
    },
    mutualGroupParticipants: {
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
        marginTop: 0,
        marginBottom: 80
    },
    deleteChatBtnText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#ED4337'
    }
});

export default DirectChatRoomDetailsScreen;