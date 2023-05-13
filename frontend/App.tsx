import React from "react";
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import { store } from './redux/store';
import { Provider } from 'react-redux';

LogBox.ignoreAllLogs();
const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerBackTitleVisible: false }}>
                    <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'WhatsChat' }} />
                    <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'WhatsChat'  }} />
                    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'WhatsChat', headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}

export default App;
