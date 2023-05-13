import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, TextInput, Alert, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BACKEND_URL } from "@env";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddDirectChatRoomForm = ({ user, socket, setRenderAddDirectChatRoomForm, setSnapPoints, closeMenuHandler }: { user: any, socket: any, setRenderAddDirectChatRoomForm: React.Dispatch<React.SetStateAction<boolean>>, setSnapPoints: any, closeMenuHandler: () => void }) => {
    const [emailInput, setEmailInput] = useState('');
    const [userResult, setUserResult] = useState<{ _id: string, username: string, email: string, profilePic: string | undefined, bio: string | undefined } | null>(null);
    const [typingTimer, setTypingTimer] = useState<any>(null);
    const navigation = useNavigation();

    const onChangeText = (email: string) => {
        setEmailInput(email);
        clearTimeout(typingTimer);
        const timer = setTimeout(() => searchUser(email), 300);
        setTypingTimer(timer);
    };

    const searchUser = async (email: string) => {
        setUserResult(null);
        if (email && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) && email !== user.email) {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${BACKEND_URL}/api/users/${email}`, { headers: { Authorization: 'Bearer ' + JSON.parse(token!) } });
            setUserResult(response.data.user);
        };
    };

    const createRoom = () => {
        socket.emit('create-direct-chat-room', { user2Id: userResult!._id });
    };

    const closeForm = () => {
        setRenderAddDirectChatRoomForm(false);
        setSnapPoints(['40%']);
    };

    useEffect(() => {
        socket.on('create-direct-chat-room', ({ room }: { room: any }) => {
            closeMenuHandler();
            navigation.navigate('Direct Chat Room' as never, { room, user2: room.users[0]._id !== user._id ? room.users[0] : room.users[1] } as never);
        });
    }, []);

    return (
        <>
            <View style={styles.header}>
                <Text style={styles.headerText}>Direct Chat</Text>
                <TouchableOpacity style={styles.cancelBtn} onPress={closeForm}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.form}>
                <TextInput style={styles.emailInput} value={emailInput} onChangeText={onChangeText} placeholder="Enter your contact's email" placeholderTextColor='#595958' autoCapitalize='none' autoCorrect={false} keyboardType="email-address" />
            </View>
            {userResult && (
                <TouchableOpacity style={styles.userResult}>
                    <Image style={styles.profilePic} source={userResult.profilePic ? userResult.profilePic : require('../assets/profile-pic.png')} />
                    <View style={styles.info}>
                        <Text style={styles.username}>{ userResult.username }</Text>
                        <Text style={styles.bio}>{ userResult.bio ? userResult.bio : 'Available' }</Text>
                    </View>
                    <TouchableOpacity style={styles.addBtn} onPress={createRoom}>
                        <Text style={styles.addBtnText}>Add</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    cancelBtn: {
        position: 'absolute',
        right: 25
    },
    cancelBtnText: {
        color: '#009EDC',
        fontSize: 18
    },
    form: {
        marginTop: 20,
        paddingHorizontal: 30,
        gap: 20
    },
    emailInput: {
        borderWidth: 1,
        borderColor: '#009EDC',
        height: 40,
        borderRadius: 10,
        paddingHorizontal: 15
    },
    addBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#009EDC',
        height: 40,
        borderRadius: 15,
        position: 'absolute',
        right: 20,
        width: 75
    },
    addBtnText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold'
    },
    userResult: {
        marginTop: 30,
        flexDirection: 'row',
        height: 80,
        borderWidth: 1,
        borderColor: '#BFBFBD',
        marginHorizontal: 30,
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 15,
        borderRadius: 10
    },
    profilePic: {
        width: 60,
        height: 120,
        top: 5
    },
    info: {
        gap: 3,
        height: '100%',
        justifyContent: 'center'
    },
    username: {
        fontWeight: 'bold',
        fontSize: 16
    },
    bio: {
        color: '#595958'
    }
});

export default AddDirectChatRoomForm;