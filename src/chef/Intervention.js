import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, View, Text, StyleSheet, Alert, TouchableOpacity, Modal, TextInput } from 'react-native';

export default function Intervention({ route, navigation, reload, setReload }) {
    const { intervention } = route.params;

    const validateIntervention = (intervention_id, status) => {
        if (status == "pre") {
            navigation.navigate('Pré-réceptions', { "id": intervention_id });
        } else {
            navigation.navigate('Réceptions', { "id": intervention_id });
        }
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
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
                    <Text style={styles.title}>Technicien : </Text>
                    <Text style={styles.text}>{intervention.Nom_personnel}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.title}>Prestation : </Text>
                    <Text style={styles.text}>{intervention.libelle ? intervention.libelle : ""}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.title}>Lieu de prélévement : </Text>
                    <Text style={styles.text}>{intervention.Lieux_ouvrage}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.title}>Observation : </Text>
                    <Text style={styles.text}>{intervention.obs ? intervention.obs : ""}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.title}>Etat d'intervention : </Text>
                    <Text style={[styles.text, intervention.status == 2 ? styles.valide : (intervention.status == 0 ? styles.annule : styles.enCours)]}>
                        {intervention.status == 1 ? "En cours" : intervention.status == 0 ? "Annulée" : "Faite"}</Text>
                </View>
                {(intervention.status == 2) ?
                    intervention.etat_reception == 1 ?
                        (<><View style={styles.row}>
                            <Text style={styles.title}>Etat de réception : </Text>
                            <Text style={[styles.text, intervention.etat_reception == 1 ? styles.valide : (intervention.status == 0 ? styles.annule : styles.enCours)]}

                            >{intervention.etat_reception}</Text>

                        </View>
                            <View style={styles.buttonView}>
                                <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={() => { validateIntervention(intervention.intervention_id, "re") }}>
                                    <Text style={styles.buttonText}>Voir réception</Text>
                                </TouchableOpacity>
                            </View>
                        </>)
                        :
                        (<>
                            <View style={styles.row}>
                                <Text style={styles.title}>Etat de réception : </Text>
                                <Text style={[styles.text, intervention.etat_reception == 1 ? styles.valide : (intervention.status == 0 ? styles.annule : styles.enCours)]}

                                >{intervention.reception}</Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={() => { validateIntervention(intervention.intervention_id, "pre") }}>
                                    <Text style={styles.buttonText}>Voir pré-réception</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                        )
                    :
                    ("")
                }

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
        // alignItems: "center",
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
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
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
