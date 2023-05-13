import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 

const FooterBar = () => {
    const navigation = useNavigation();
    const route = useRoute().name;

    return (
        <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Chats' as never)}>
                <Entypo name="chat" size={30} color={route === 'Chats List' ? "#00AFF0" : "#999997"} />
                <Text style={{ color: route === 'Chats List' ? "#00AFF0" : "#999997" }}>Chats</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Setting' as never)}>
                <AntDesign name="setting" size={30} color={route === 'Setting' ? '#00AFF0' : "#999997"} />
                <Text style={{ color: route === 'Setting' ? "#00AFF0" : "#999997" }}>Setting</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 70,
        backgroundColor: '#FAFAFA',
        paddingVertical: 5,
        borderTopColor: '#E6E6E3',
        borderTopWidth: 1,
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        right: 0,
    },
    iconContainer: {
        alignItems: 'center',
    }
});

export default FooterBar;