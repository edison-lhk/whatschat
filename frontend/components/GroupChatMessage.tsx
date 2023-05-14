import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import moment from 'moment';
import { UserType } from "../types/app";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const GroupChatMessage = ({ sender, text, createdAt }: { sender: UserType, text: string, createdAt: string }) => {
    const user = useSelector((state: RootState) => state.user);

    return (
        <>
            {user._id !== sender._id ? (
                <View style={styles.messageReceived}>
                    <Image style={{ width: 40, height: sender.profilePic ? 40 : 90, borderRadius: 40 / 2 }} source={sender.profilePic ? { uri: sender.profilePic } : require('../assets/profile-pic.png')} />
                    <View style={styles.infoContainer}>
                        <View style={styles.senderContainer}>
                            <Text style={styles.username}>~{ sender.username }</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{ text }</Text>
                            <Text style={styles.time}>{ moment(createdAt).format("hh:mm a") }</Text>
                        </View>
                    </View>
                </View>
            ) : (
                <View style={[styles.messageSent, { backgroundColor: '#25D366', alignSelf: 'flex-end' }]}>
                    <Text style={styles.text}>{ text }</Text>
                    <Text style={styles.time}>{ moment(createdAt).format("hh:mm a") }</Text>
                </View>
            )}
        </>
        );
};  

const styles = StyleSheet.create({
    messageReceived: {
        minHeight: 60,
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 10,
        marginVertical: 5,
    },
    infoContainer: {
        borderRadius: 12,
        paddingTop: 5,
        paddingBottom: 10,
        paddingHorizontal: 15,
        justifyContent: 'center',
        backgroundColor: 'white',
        gap: 5,
        width: '90%'
    },
    senderContainer: {
        alignSelf: 'flex-end'
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10
    },
    username: {
        color: '#999997'
    },
    messageSent: {
        width: '70%',
        minHeight: 40,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
    },
    text: {
        fontSize: 16,
        width: '70%'
    },
    time: {
        fontSize: 13,
        color: '#595958'
    }
});

export default GroupChatMessage;