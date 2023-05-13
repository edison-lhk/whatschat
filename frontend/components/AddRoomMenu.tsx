import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import AddDirectChatRoomForm from "./AddDirectChatRoomForm";
import AddGroupChatRoomForm from "./AddGroupChatRoomForm";
import { MaterialIcons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 

const AddRoomMenu = ({ user, socket, bottomSheetRef, setDirectChatRooms, setGroupChatRooms, setShowAddRoomMenu }: { user: any, socket: any, bottomSheetRef: React.RefObject<BottomSheet>, setDirectChatRooms: React.Dispatch<React.SetStateAction<any>>, setGroupChatRooms: React.Dispatch<React.SetStateAction<any>>, setShowAddRoomMenu: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [renderAddDirectChatRoomForm, setRenderAddDirectChatRoomForm] = useState(false);
    const [renderAddGroupChatRoomForm, setRenderAddGroupChatRoomForm] = useState(false);
    const [snapPoints, setSnapPoints] = useState(['40%']);

    const closeMenuHandler = () => {
        bottomSheetRef!.current!.close();
        setShowAddRoomMenu(false);
    };

    const openAddDirectChatRoomForm = () => {
        setRenderAddDirectChatRoomForm(true);
        setSnapPoints(['50%']);
    };

    const openAddGroupChatRoomForm = () => {
        setRenderAddGroupChatRoomForm(true);
        setSnapPoints(['90%', '100%']);
    };

    return (
        <BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints} enablePanDownToClose={true}>
            <BottomSheetView style={styles.container}>
                {!renderAddDirectChatRoomForm && !renderAddGroupChatRoomForm ? (
                    <>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>New Chat</Text>
                            <TouchableOpacity style={styles.cancelBtn} onPress={closeMenuHandler}>
                                <MaterialIcons name="cancel" size={30} color="#E6E6E3" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.optionsContainer}>
                            <TouchableOpacity style={styles.option} onPress={openAddDirectChatRoomForm}>
                                <View style={styles.optionIcon}>
                                    <AntDesign name="adduser" size={24} color="#009EDC" />
                                </View>
                                <Text style={styles.optionText}>New Contact</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.option} onPress={openAddGroupChatRoomForm}>
                                <View style={styles.optionIcon}>
                                    <AntDesign name="addusergroup" size={24} color="#009EDC" />
                                </View>
                                <Text style={styles.optionText}>New Group</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : renderAddDirectChatRoomForm ? (
                    <AddDirectChatRoomForm user={user} socket={socket} setRenderAddDirectChatRoomForm={setRenderAddDirectChatRoomForm} setSnapPoints={setSnapPoints} closeMenuHandler={closeMenuHandler} />
                ) : (
                    <AddGroupChatRoomForm user={user} socket={socket} setRenderAddGroupChatRoomForm={setRenderAddGroupChatRoomForm} setSnapPoints={setSnapPoints} closeMenuHandler={closeMenuHandler} />
                )}
            </BottomSheetView>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    header: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    cancelBtn: {
        position: 'absolute',
        right: 20
    },
    optionsContainer: {
        marginTop: 10
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E6E6E3',
        paddingVertical: 10
    },
    optionIcon: {
        backgroundColor: '#E6E6E3',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 50
    },
    optionText: {
        color: '#009EDC',
        fontSize: 18
    }
});

export default AddRoomMenu;