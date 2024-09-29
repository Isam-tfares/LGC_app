import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';


const ChangeAPIURL = ({ modalVisible, setModalVisible, dispatch, setBaseURL, setApiUrl }) => {
    const [currentAPIUrl, setCurrentAPIUrl] = useState('');
    const [newAPIUrl, setNewAPIUrl] = useState('');

    const directoryPath = `${FileSystem.documentDirectory}LGC/`;
    const fileUri = `${directoryPath}api.txt`;

    useEffect(() => {
        const loadCurrentAPIUrl = async () => {
            try {
                const content = await FileSystem.readAsStringAsync(fileUri);
                setCurrentAPIUrl(content);
            } catch (error) {
                console.error('Error reading API URL from file:', error);
            }
        };

        loadCurrentAPIUrl();
    }, []);

    const handleUpdateAPIUrl = async () => {
        try {
            await FileSystem.writeAsStringAsync(fileUri, newAPIUrl);
            Alert.alert('API URL est mise à jour avec succès');
            let new_base_url = `http://${newAPIUrl}/LGC_backend`;
            dispatch(setBaseURL(new_base_url));
            setApiUrl(new_base_url);
            setCurrentAPIUrl(newAPIUrl);
            setNewAPIUrl('');
            setModalVisible(false);
        } catch (error) {
            console.error('Error writing new API URL to file:', error);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={styles.close}
                        onPress={() => setModalVisible(false)}
                    >
                        <Ionicons name="close-circle-sharp" size={40} color="red" />
                    </TouchableOpacity>
                    <Text style={styles.modalText}>URL de l'API actuelle :</Text>
                    <TextInput
                        style={styles.input}
                        value={currentAPIUrl}
                        editable={false}
                    />
                    <Text style={styles.modalText}>Nouvelle URL d'API :</Text>
                    <TextInput
                        style={styles.input}
                        value={newAPIUrl}
                        onChangeText={setNewAPIUrl}
                    />
                    <Button title="Enregistrer" onPress={handleUpdateAPIUrl} />
                </View>
            </View>
        </Modal>



    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    close: {
        position: "absolute",
        top: -15,
        right: -15,
    },
    modalView: {
        position: "relative",
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalText: {
        marginBottom: 10,
        fontSize: 18,
    },
    input: {
        width: 200,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginBottom: 15,
        padding: 10,
    },
});

export default ChangeAPIURL;
