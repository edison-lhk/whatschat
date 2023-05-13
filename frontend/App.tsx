import React, { useState } from "react";
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";

LogBox.ignoreAllLogs();
const Stack = createNativeStackNavigator();

const App = () => {
    let initialUser;
    AsyncStorage.getItem('user').then(value => value ? initialUser = JSON.stringify(value) : initialUser = null).catch(error => initialUser = null);
    const [user, setUser] = useState(initialUser);

    return (
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerBackTitleVisible: false }}>
                    {!user ? (
                        <Stack.Group>
                            <Stack.Screen name="Login" component={LoginScreen} initialParams={{ setUser }} options={{ title: 'WhatsChat' }} />
                            <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'WhatsChat'  }} />
                        </Stack.Group>
                    ): (
                        <Stack.Group>
                            <Stack.Screen name="Home" component={HomeScreen} initialParams={{ user, setUser }} options={{ title: 'WhatsChat', headerShown: false }} />
                        </Stack.Group>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
    );
}

export default App;
