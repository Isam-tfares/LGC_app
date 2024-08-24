import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import moment from 'moment';

export default function Intervention({ route, navigation }) {
    const TOKEN = useSelector(state => state.user.token)
    const { intervention } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [comment, setComment] = useState('');

    const annulateIntervention = async () => {

        let API_URL = 'http://10.0.2.2/LGC_backend/?page=annulerIntervention';
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    { "obs": comment, "intervention_id": intervention.intervention_id }
                )
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                data = JSON.parse(text);
            }
            if (data != null) {
                if (data) {
                    Alert.alert("Intervention annulée avec succès");
                } else {
                    Alert.alert("Un problème est survenu lors du annulation du intervention");
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const annulerIntervention = () => {
        // Logic to handle the comment submission or cancellation
        if (comment === '') {
            Alert.alert('Veuillez ajouter un commentaire');
            return;
        }
        annulateIntervention();
        setModalVisible(false);
        navigation.goBack();
    };
    const validateIntervention = (intervention_id) => {
        navigation.navigate('Nouvelle réception', { "id": intervention_id });
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.row}>
                    <Text style={styles.title}>N° Intervention :</Text>
                    <Text style={styles.text}>{intervention.intervention_id}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.title}>Client:</Text>
                    <Text style={styles.text}>{intervention.abr_client}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.title}>Projet : </Text>
                    <Text style={styles.text}>{intervention.abr_projet}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.title}>Objet : </Text>
                    <Text style={styles.text}>{intervention.Objet_Projet}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.title}>Prestation : </Text>
                    <Text style={styles.text}>{intervention.libelle}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.title}>Lieu de prélévement : </Text>
                    <Text style={styles.text}>{intervention.adresse ?? ""}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.title}>Date d'intervention : </Text>
                    <Text style={styles.text}>{intervention.date_intervention ? moment(intervention.date_intervention, "YYYYMMDD").format("DD/MM/YYYY") || 'N/A' : null}</Text>
                </View>
                {intervention.status == 0 ? (
                    <View style={styles.row}>
                        <Text style={styles.title}>Observation : </Text>
                        <Text style={styles.obs}>{intervention.obs}</Text>
                    </View>
                ) : <></>}
                {/* {intervention.status == 2 ? ( */}
                <View style={styles.row}>
                    <Text style={styles.title}>Etat d'intervention : </Text>
                    <Text style={[styles.text, intervention.status == 2 ? styles.valide : (intervention.status == 0 ? styles.annule : styles.enCours)]}

                    >{intervention.status == 0 ? "Annulée" : intervention.status == 1 ? "En cours" : "Faite"}</Text>
                </View>
                {/* ) : <></>} */}
                {(intervention.status == 2) ?
                    <View style={styles.row}>
                        <Text style={styles.title}>Etat de réception : </Text>
                        <Text style={[styles.text, intervention.etat_reception == 1 ? styles.valide : styles.enCours]}

                        >{intervention.etat_reception == 1 ? "Faite" : "En cours"}</Text>
                    </View>
                    : ""
                }
                {intervention.status == 1 ? (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={() => { validateIntervention(intervention.intervention_id) }}>
                            <Text style={styles.buttonText}>Valider</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => { setModalVisible(true) }}>
                            <Text style={styles.buttonText}>Annuler</Text>
                        </TouchableOpacity>
                    </View>) : (<></>
                )
                }


            </View>

            {/* Annulation modal */}
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
                        <TouchableOpacity style={styles.close}
                            onPress={() => setModalVisible(false)}
                        >
                            <Ionicons name="close-circle-sharp" size={40} color="red" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Ajouter un commentaire</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Comment"
                            value={comment}
                            onChangeText={setComment}
                            placeholderTextColor="#ccc"
                        />
                        <TouchableOpacity style={styles.modalButton} onPress={() => { annulerIntervention() }}>
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
    row: {
        flexDirection: 'row',
        marginBottom: 20,
        paddingEnd: 5,
        justifyContent: "space-between",
        width: "100%"
    },
    title: {
        fontSize: 16,
        paddingEnd: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        width: "80%",
    },
    obs: {
        fontSize: 15,
        color: "#2f2f2f",
        paddingTop: 5,
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
    close: {
        position: "absolute",
        top: -15,
        right: -15,
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
    valide: {
        color: "green",
        fontSize: 17,
    },
    annule: {
        color: "red",
        fontSize: 17,
    },
    enCours: {
        color: "#4bacc0",
        fontSize: 17,
    },
});
