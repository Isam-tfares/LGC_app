import React, { useState } from 'react';
import { Button, View, Text, StyleSheet, Alert, TouchableOpacity, Modal, TextInput } from 'react-native';

export default function Intervention({ route, navigation }) {
    const { intervention } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [comment, setComment] = useState('');

    const handleAnnuler = () => {
        // Logic to handle the comment submission or cancellation
        if (comment === '') {
            Alert.alert('Veuillez ajouter un commentaire');
            return;
        }
        Alert.alert("Intervention annulée avec succès");
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Client:</Text>
                <Text style={styles.text}>{intervention.client}</Text>
                <Text style={styles.title}>Projet:</Text>
                <Text style={styles.text}>{intervention.projet}</Text>
                <Text style={styles.title}>Adresse:</Text>
                <Text style={styles.text}>{intervention.adresse}</Text>
                <Text style={styles.title}>Type:</Text>
                <Text style={styles.text}>{intervention.type}</Text>

                {intervention.status === 'Non faite' ? (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={() => { Alert.alert('Pour Confirmer intervention ' + intervention.id + '\nVeuillez charger le PV') }}>
                            <Text style={styles.buttonText}>Confirmer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => { setModalVisible(true) }}>
                            <Text style={styles.buttonText}>Annuler</Text>
                        </TouchableOpacity>
                    </View>) : (
                    intervention.status === 'faite' ?
                        (<>
                            <View style={{ marginTop: 10 }}>
                                <Button title='Intervention faite' color="green" />
                            </View>
                        </>) :
                        (<>
                            <Text style={styles.title}>Observation:</Text>
                            <Text style={styles.text}>{intervention.obs}</Text>
                            <View style={{ marginTop: 10 }}>
                                <Button title='Intervention annulée' color="red" />
                            </View>
                        </>)
                )
                }

            </View>

            {/* Modal for annuler intervention */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Ajouter un commentaire</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Comment"
                            value={comment}
                            onChangeText={setComment}
                            placeholderTextColor="#ccc"
                        />
                        <TouchableOpacity style={styles.modalButton} onPress={handleAnnuler}>
                            <Text style={styles.modalButtonText}>Valider</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
        width: '100%',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    confirmButton: {
        backgroundColor: '#0853a1',
    },
    cancelButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
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
    input: {
        width: '100%',
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: 'red',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        width: '100%',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
