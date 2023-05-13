import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import moment from 'moment';

const GroupChatMessage = ({ user, sender, text, createdAt }: { user: any, sender: any, text: string, createdAt: string }) => {
    return (
        <>
            {user._id !== sender._id ? (
                <View style={styles.messageReceived}>
                    <Image style={styles.profilePic} source={sender.profilePic ? sender.profilePic : require('../assets/profile-pic.png')} />
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
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 10,
        marginVertical: 5,
    },
    profilePic: {
        width: 40,
        height: 90
    },
    infoContainer: {
        minHeight: 40,
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
    },
    username: {
        color: '#999997'
    },
    messageSent: {
        width: '70%',
        minHeight: 40,
        borderRadius: 12,
        paddingVertical: 5,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5
    },
    text: {
        fontSize: 16
    },
    time: {
        fontSize: 13,
        color: '#595958'
    }
});

export default GroupChatMessage;