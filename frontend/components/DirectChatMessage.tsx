import React from "react";
import { StyleSheet, View, Text } from "react-native";
import moment from 'moment';
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const DirectChatMessage = ({ sender, text, createdAt }: { sender: string, text: string, createdAt: string }) => {
    const user = useSelector((state: RootState) => state.user);

    return (
        <View style={[styles.message, { backgroundColor: user._id === sender ? '#25D366' : 'white', alignSelf: user._id === sender ? 'flex-end' : 'flex-start' }]}>
            <Text style={styles.text}>{ text }</Text>
            <Text style={styles.time}>{ moment(createdAt).format("hh:mm a") }</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    message: {
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

export default DirectChatMessage;