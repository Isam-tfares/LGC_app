import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';

export default function DemandeIntervention({ route, navigation }) {
    const { intervention } = route.params;

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
                    <Text style={styles.title}>Date du creation : </Text>
                    <Text style={styles.text}>{intervention.date_creation ? moment(intervention.date_creation, "YYYYMMDD").format("DD/MM/YYYY") || 'N/A' : null}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.title}>Date d'intervention : </Text>
                    <Text style={styles.text}>{intervention.date_intervention ? moment(intervention.date_intervention, "YYYYMMDD").format("DD/MM/YYYY") || 'N/A' : null}</Text>
                </View>

            </View>

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
