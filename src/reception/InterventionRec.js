import React, { useState } from 'react';
import { Button, View, Text, StyleSheet, Alert, TouchableOpacity, Modal, TextInput } from 'react-native';
import AddReception from './AddReception';

export default function InterventionRec({ route, navigation }) {
    const { intervention } = route.params;
    const [AddModalVisible, setAddModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.row}>
                    <Text style={styles.title}>Client:</Text>
                    <Text style={styles.text}>{intervention.client}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.title}>Projet : </Text>
                    <Text style={styles.text}>{intervention.projet}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.title}>Objet : </Text>
                    <Text style={styles.text}>{intervention.object}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.title}>Prestation : </Text>
                    <Text style={styles.text}>{intervention.Prestation ? intervention.Prestation : ""}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.title}>Matériaux : </Text>
                    <Text style={styles.text}>{intervention.Materiaux ? intervention.Materiaux : ""}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.title}>Lieu de prélévement : </Text>
                    <Text style={styles.text}>{intervention.adresse}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.title}>Etat de récupération : </Text>
                    <Text style={styles.text}>{intervention.recuperation ? intervention.recuperation : ""}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.title}>Etat d'intervention : </Text>
                    <Text style={[styles.text, intervention.status == "faite" ? styles.valide : (intervention.status == "annulée" ? styles.annule : styles.enCours)]}

                    >{intervention.status}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.title}>Observation : </Text>
                    <Text>{intervention.obs ? intervention.obs : ""}</Text>
                </View>

                {(intervention.status == "faite") ?
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={() => { setAddModalVisible(true) }}>
                            <Text style={styles.buttonText}>Confirmer récéption</Text>
                        </TouchableOpacity>
                    </View>
                    : ""
                }
            </View>
            <AddReception modalVisible={AddModalVisible} setModalVisible={setAddModalVisible} />
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
        alignItems: "center",
        marginBottom: 20,
        paddingEnd: 5,
        justifyContent: "space-between"
    },
    title: {
        fontSize: 16,
        paddingEnd: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
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
