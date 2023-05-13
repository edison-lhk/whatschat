import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MessageBar = ({ socket, roomId, type }: { socket: any, roomId: string, type: string }) => {
    const [message, setMessage] = useState('');
    const [messageBarHeight, setMessageBarHeight] = useState(45);

    const sendMessage = () => {
        if (message) {
            socket.emit(`send-${type}-chat`, { roomId, message });
            setMessage('');
        };
    };

    return (
        <View style={[styles.messageBar, { height: messageBarHeight }]}>
            <TextInput 
                style={styles.messageInput} 
                value={message} 
                onChangeText={text => setMessage(text)} 
                onContentSizeChange={e => {
                    if (e.nativeEvent.contentSize.height > 45) {
                        setMessageBarHeight(e.nativeEvent.contentSize.height + 30);
                    } else if (e.nativeEvent.contentSize.height > 30) {
                        setMessageBarHeight(60);
                    } else {
                        setMessageBarHeight(45);
                    }
                }} 
                multiline 
                autoCapitalize='none'
                autoComplete="off" 
            />
            <TouchableOpacity style={styles.sendIcon} onPress={sendMessage}>
                <MaterialCommunityIcons name="send-circle" size={40} color="#009EDC" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    messageBar: {
        paddingVertical: 8,
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    messageInput: {
        height: '100%',
        width: '85%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#BFBFBD',
        paddingHorizontal: 15,
    },
    sendIcon: {
        position: 'absolute',
        right: 25,
    }
});

export default MessageBar;