import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text, TextInput, Alert, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BACKEND_URL } from "@env";
import { Fontisto } from '@expo/vector-icons';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GroupChatRoomType, UserType } from "../types/app";
import { Socket } from "socket.io-client";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const AddGroupChatRoomForm = ({ socket, setRenderAddGroupChatRoomForm, setSnapPoints, closeMenuHandler }: { socket: Socket, setRenderAddGroupChatRoomForm: React.Dispatch<React.SetStateAction<boolean>>, setSnapPoints: React.Dispatch<React.SetStateAction<string[]>>, closeMenuHandler: () => void }) => {
    const user = useSelector((state: RootState) => state.user);
    const [groupNameInput, setGroupNameInput] = useState<string>('');
    const [emailInput, setEmailInput] = useState<string>('');
    const [userResult, setUserResult] = useState<UserType | null>(null);
    const [users, setUsers] = useState<UserType[]>([user]);
    const [typingTimer, setTypingTimer] = useState<any>(null);
    const emailInputRef = useRef<TextInput>(null);
    const navigation = useNavigation();

    const closeForm = () => {
        setRenderAddGroupChatRoomForm(false);
        setSnapPoints(['40%'])
    };

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

    const addUser = () => {
        setUsers((prevUsers: UserType[]) => [...prevUsers, userResult] as UserType[]);
        setUserResult(null);
        setEmailInput('');
        emailInputRef!.current!.blur();
    };

    const removeUser = (userId: string) => {
        setUsers(users.filter((user: any) => user._id !== userId));
    }; 

    const createRoom = () => {
        if (groupNameInput && users.length > 1) {
            socket.emit('create-group-chat-room', { name: groupNameInput, userIds: users.map(user => user._id) });
        } else {
            Alert.alert('Error', 'Please provide a group name & participants', [{ text: 'Ok' }]);
        };
    };

    useEffect(() => {
        socket.on('create-group-chat-room', ({ room }: { room: GroupChatRoomType }) => {
            closeMenuHandler();
        });
    }, []);

    return (
        <>
            <View style={styles.header}>
                <Text style={styles.headerText}>Group Chat</Text>
                <TouchableOpacity style={styles.cancelBtn} onPress={closeForm}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.form}>
                <TextInput style={styles.groupNameInput} value={groupNameInput} onChangeText={(text) => setGroupNameInput(text)} placeholder="Enter group name" placeholderTextColor='#595958' autoCapitalize='none' autoCorrect={false} />
                <TextInput ref={emailInputRef} style={styles.emailInput} value={emailInput} onChangeText={onChangeText} placeholder="Enter your participant's email" placeholderTextColor='#595958' autoCapitalize='none' autoCorrect={false} keyboardType="email-address" />
                <TouchableOpacity style={styles.createBtn} onPress={createRoom}>
                    <Text style={styles.createBtnText}>Create</Text>
                </TouchableOpacity>
            </View>
            {userResult && (
                <TouchableOpacity style={styles.userResult}>
                    <Image style={{ width: 60, height: userResult.profilePic ? 60 : 120, top: userResult.profilePic ? 0 : 5, borderRadius: 60 / 2 }} source={userResult.profilePic ? { uri: userResult.profilePic } : require('../assets/profile-pic.png')} />
                    <View style={styles.info}>
                        <Text style={styles.username}>{ userResult.username }</Text>
                        <Text style={styles.bio}>{ userResult.bio ? userResult.bio : 'Available' }</Text>
                    </View>
                    <TouchableOpacity style={styles.addBtn} onPress={addUser}>
                        <Text style={styles.addBtnText}>Add</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            )}
            <ScrollView style={styles.usersList}>
                { users.filter(eachUser => eachUser._id !== user._id).map(user => (
                    <TouchableOpacity style={styles.user}>
                        <Image style={{ width: 60, height: user.profilePic ? 60 : 120, top: user.profilePic ? 0 : 5, borderRadius: 60 / 2 }} source={user.profilePic ? { uri: user.profilePic } : require('../assets/profile-pic.png')} />
                        <View style={styles.info}>
                            <Text style={styles.username}>{ user.username }</Text>
                            <Text style={styles.bio}>{ user.bio ? user.bio : 'Available' }</Text>
                        </View>
                        <TouchableOpacity style={styles.includeBtn} onPress={() => removeUser(user!._id!)}>
                            <Fontisto name="checkbox-active" size={27} color="#009EDC" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )) }
            </ScrollView>
        </>
    )
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
    groupNameInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#009EDC',
        height: 40,
        borderRadius: 10,
        paddingHorizontal: 15
    },
    emailInput: {
        borderWidth: 1,
        borderColor: '#009EDC',
        height: 40,
        borderRadius: 10,
        paddingHorizontal: 15
    },
    createBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#009EDC',
        height: 40,
        borderRadius: 15,
    },
    createBtnText: {
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
    },
    includeBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        borderRadius: 15,
        position: 'absolute',
        right: 25,
        width: 30
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
    usersList: {
        marginTop: 30,
        borderTopWidth: 1,
        borderTopColor: '#BFBFBD',
        marginHorizontal: 30,
        paddingVertical: 15
    },
    user: {
        marginTop: 20,
        flexDirection: 'row',
        height: 80,
        borderWidth: 1,
        borderColor: '#BFBFBD',
        alignItems: 'center',
        gap: 15,
        borderRadius: 10,
        paddingHorizontal: 20
    }
});

export default AddGroupChatRoomForm;