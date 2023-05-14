import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View, Image, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, Platform, KeyboardAvoidingView } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from "axios";
import { BACKEND_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootState } from "../redux/store";
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from "../redux/features/userSlice";

const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    const loginUser = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please provide all fields', [{ text: 'ok' }]);
            return;
        };
        try {
            const response = await axios.post(`${BACKEND_URL}/api/auth/login`, { email, password });
            await AsyncStorage.setItem('token', JSON.stringify(response.data.token));
            dispatch(setUser(response.data.user));
            setEmail('');
            setPassword('');
            navigation.navigate('Home' as never);
        } catch(error: any) {
            Alert.alert('Error', error.response.data.error ? error.response.data.error : error.message , [{ text: 'ok' }]);
        }
    };

    const clearAsyncStorage = async () => {
        await AsyncStorage.clear();  
    };

    const navigateSignup = () => {
        navigation.navigate('Signup' as never);
        setEmail('');
        setPassword('');
    };

    useEffect(() => {
        if (user.online) {
            navigation.navigate('Home' as never);
        } else {
            clearAsyncStorage();
        }
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.screenContainer}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../assets/logo.png')} />
                    <Text style={styles.logoText}>WhatsChat</Text>
                </View>
                <KeyboardAvoidingView style={styles.loginFormContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height' }>
                    <View style={styles.loginForm}>
                        <TextInput style={styles.input} value={email} onChangeText={text => setEmail(text)} placeholder="Email" placeholderTextColor='#999997' keyboardType="email-address" autoCapitalize='none' autoComplete="off" autoCorrect={false} />
                        <TextInput style={styles.input} value={password} onChangeText={text => setPassword(text)} placeholder="Password" placeholderTextColor='#999997' autoComplete="off" autoCapitalize='none' autoCorrect={false} secureTextEntry={true} />
                        <TouchableOpacity style={styles.loginBtn} onPress={loginUser}>
                            <Text style={styles.loginBtnText}>LOGIN</Text>
                        </TouchableOpacity> 
                    </View>
                    <View style={styles.signupPromptContainer}>
                        <Text>Don't have an account?</Text>
                        <TouchableOpacity onPress={navigateSignup}>
                            <Text style={styles.signupText}>Signup</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        height: 100,
        width: 100
    },
    logoText: {
        fontWeight: 'bold',
        fontSize: 25
    },
    loginFormContainer: {
        width: '100%',
        paddingHorizontal: 50,
        gap: 15
    },
    loginForm: {
        gap: 20
    },
    input: {
        borderRadius: 20,
        width: '100%',
        height: 45,
        backgroundColor: '#E6E6E3',
        paddingHorizontal: 30
    },
    loginBtn: {
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#009EDC',
        borderRadius: 20,
        height: 45,
        width: '100%'
    },
    loginBtnText: {
        color: 'white',
        fontWeight: '900',
    },
    signupPromptContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    signupText: {
        color: '#00AFF0'
    }
});

export default LoginScreen;