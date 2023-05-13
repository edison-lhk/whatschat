import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View, Image, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, Platform, KeyboardAvoidingView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import { BACKEND_URL } from "@env";
import { RootState } from "../redux/store";
import { useSelector } from 'react-redux';

const SignupScreen = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const user = useSelector((state: RootState) => state.user);

    const signupUser = async () => {
        if (!username || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please provide all fields', [{ text: 'ok' }]);
            return;
        };
        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            Alert.alert('Error', 'Please provide a valid email', [{ text: 'ok' }]);
            return;
        };
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Password do not match', [{ text: 'ok' }]);
            return;
        };
        if (password.length < 8) {
            Alert.alert('Error', 'Please provide a valid password with 8 characters or more', [{ text: 'ok' }]);
            return;
        };
        try {
            await axios.post(`${BACKEND_URL}/api/auth/sign-up`, { username, email, password });
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            navigation.navigate('Login' as never);
        } catch(error: any) {
            Alert.alert('Error', error.response.data.error, [{ text: 'ok' }]);
        }; 
    };

    useEffect(() => {
        if (user.online) navigation.navigate('Home' as never);
    });

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.screenContainer}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../assets/logo.png')} />
                    <Text style={styles.logoText}>WhatsChat</Text>
                </View>
                <KeyboardAvoidingView style={styles.signupFormContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height' }>
                    <View style={styles.signupForm}>
                        <TextInput style={styles.input} value={username} onChangeText={text => setUsername(text)} placeholder="Username" placeholderTextColor='#999997' autoCapitalize='none' autoComplete="off" autoCorrect={false} />
                        <TextInput style={styles.input} value={email} onChangeText={text => setEmail(text)} placeholder="Email" placeholderTextColor='#999997' keyboardType="email-address" autoCapitalize='none' autoComplete="off" autoCorrect={false} />
                        <TextInput style={styles.input} value={password} onChangeText={text => setPassword(text)} placeholder="Password" placeholderTextColor='#999997' autoComplete="off" autoCapitalize='none' autoCorrect={false} secureTextEntry={true} />
                        <TextInput style={styles.input} value={confirmPassword} onChangeText={text => setConfirmPassword(text)} placeholder="Confirm Password" placeholderTextColor='#999997' autoCapitalize='none' autoComplete="off" autoCorrect={false} secureTextEntry={true} />
                        <TouchableOpacity style={styles.signupBtn} onPress={signupUser}>
                            <Text style={styles.signupBtnText}>SIGN UP</Text>
                        </TouchableOpacity> 
                    </View>
                    <View style={styles.loginPromptContainer}>
                        <Text>Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                            <Text style={styles.loginText}>Login</Text>
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
    signupFormContainer: {
        width: '100%',
        paddingHorizontal: 50,
        gap: 15
    },
    signupForm: {
        gap: 20
    },
    input: {
        borderRadius: 20,
        width: '100%',
        height: 45,
        backgroundColor: '#E6E6E3',
        paddingHorizontal: 30
    },
    signupBtn: {
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#009EDC',
        borderRadius: 20,
        height: 45,
        width: '100%'
    },
    signupBtnText: {
        color: 'white',
        fontWeight: '900',
    },
    loginPromptContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    loginText: {
        color: '#00AFF0'
    }
});

export default SignupScreen;