import React, { useState } from "react";
import { StyleSheet, SafeAreaView, TouchableWithoutFeedback, Keyboard, View, Text, TouchableOpacity, Image, TextInput, Alert, Platform } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import FooterBar from "../components/FooterBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import { BACKEND_URL } from "@env";
import { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, updateProfilePic, updateUsername, updateBio, logoutUser } from "../redux/features/userSlice";

const SettingScreen = () => {
    const user = useSelector((state: RootState) => state.user);
    const { socket } = useRoute().params as { socket: any };
    const [profilePic, setProfilePic] = useState(user.profilePic);
    const [username, setUsername] = useState(user.username);
    const [typingUsernameTimer, setTypingUsernameTimer] = useState<any>(null);
    const [bio, setBio] = useState(user.bio ? user.bio : 'Available');
    const [typingBioTimer, setTypingBioTimer] = useState<any>(null);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const editProfilePic = async () => {
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
            const name = `${user._id}-profile-pic.` + filename.split('.').pop(); 
            const formData = new FormData();
            formData.append('profile-pic', { uri, name, type } as unknown as File);
            const token = await AsyncStorage.getItem('token');
            try {
                const response = await axios.patch(`${BACKEND_URL}/api/users/update-profile-pic/${user._id}`, formData, { headers: { Authorization: 'Bearer ' + JSON.parse(token as string), "Content-Type": 'multipart/form-data' } });
                setProfilePic(response.data.profilePic);
                dispatch(updateProfilePic(response.data.profilePic));
            } catch(error: any) {
                Alert.alert('Error', error.response.data.error ? error.response.data.error : error.message, [{ text: 'Ok' }]);
            }
        };
    };

    const onChangeUsername = (text: string) => {
        setUsername(text);
        clearTimeout(typingUsernameTimer);
        const timer = setTimeout(() => editUsername(text), 2000);
        setTypingUsernameTimer(timer);
    };

    const editUsername = async (text: string) => {
        if (username) {
            const token = await AsyncStorage.getItem('token');
            await axios.patch(`${BACKEND_URL}/api/users/update-username/${user._id}`, { username: text }, { headers: { Authorization: 'Bearer ' + JSON.parse(token!) } });
            dispatch(updateUsername(text));
        };
    };

    const onChangeBio = (text: string) => {
        setBio(text);
        clearTimeout(typingBioTimer);
        const timer = setTimeout(() => editBio(text), 2000);
        setTypingBioTimer(timer);
    };

    const editBio = async (text: string) => {
        if (bio) {
            const token = await AsyncStorage.getItem('token');
            await axios.patch(`${BACKEND_URL}/api/users/update-bio/${user._id}`, { bio: text }, { headers: { Authorization: 'Bearer ' + JSON.parse(token!) } });
            dispatch(updateBio(text));
        };
    };

    const renderLogoutModal = () => {
        Alert.alert('Confirmation', 'Are you sure you want to logout?', [
            { text: 'No' },
            { text: 'Yes', onPress: logout }
        ]);
    };

    const logout = async () => {
        socket.emit('offline-notification');
        dispatch(logoutUser());
        socket.disconnect();
        navigation.navigate('Login' as never);
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.screenContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Setting</Text>
                </View>
                <View style={styles.settingContainer}>
                    <View style={styles.profileContainer}>
                        <Image style={{ width: profilePic? 70 : 70, height: profilePic? 70 : 150, borderRadius: 50, top: profilePic? 0 : 5  }} source={profilePic? { uri: profilePic } : require('../assets/profile-pic.png')} />
                        <TouchableOpacity style={styles.editProfilePicBtn} onPress={editProfilePic}>
                            <Text style={styles.editProfilePicBtnText}>Edit</Text>
                        </TouchableOpacity>
                        <View style={styles.username}>
                        <TextInput style={styles.usernameText} value={username} onChangeText={onChangeUsername} autoComplete="off" autoCorrect={false} autoCapitalize='none' />
                        </View>
                    </View>
                    <View style={styles.emailContainer}>
                        <Text style={styles.emailHeaderText}>Email</Text>
                        <View style={styles.email}>
                            <Text style={styles.emailText}>{ user.email }</Text>
                        </View>
                    </View>
                    <View style={styles.bioContainer}>
                        <Text style={styles.bioHeaderText}>About Me</Text>
                            <View style={styles.bio}>
                                <TextInput style={styles.bioText} value={bio} onChangeText={onChangeBio} autoComplete="off" autoCorrect={false} autoCapitalize='none' multiline />
                            </View>
                        </View>
                    <TouchableOpacity style={styles.logoutBtn} onPress={renderLogoutModal}>
                        <Text style={styles.logoutBtnText}>Logout</Text>
                    </TouchableOpacity>
                </View>
                <FooterBar />
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        gap: 20
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 15,
        marginTop: 30
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    settingContainer: {
        gap: 20
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 20,
        gap: 20,
        height: 150
    },
    editProfilePicBtn: {
        position: 'absolute',
        left: 42,
        bottom: 15
    },
    editProfilePicBtnText: {
        color: '#00AFF0',
        fontSize: 16
    },
    username: {
        justifyContent: 'center',
        width: '70%'
    },
    usernameText: {
        fontSize: 19,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: '#999997',
        paddingHorizontal: 5,
        paddingVertical: 5,
    },
    emailContainer: {
        gap: 5
    },
    emailHeaderText: {
        color: '#999997',
        marginHorizontal: 20
    },
    email: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    emailText: {
        fontSize: 17
    },
    bioContainer: {
        gap: 5
    },
    bioHeaderText: {
        color: '#999997',
        marginHorizontal: 20
    },
    bio: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'center'
    },
    bioText: {
        fontSize: 17
    },
    logoutBtn: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25
    },
    logoutBtnText: {
        paddingVertical: 15,
        fontSize: 17,
        color: '#ED4337',
        fontWeight: 'bold'
    }
});

export default SettingScreen;