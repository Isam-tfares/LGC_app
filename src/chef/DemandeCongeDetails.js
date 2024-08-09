import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import moment from 'moment';
import 'moment/locale/fr'; // Import French locale for month names

function formatDate(inputDate) {
    // Parse the date using moment
    const date = moment(inputDate, "DD/MM/YYYY");

    // Format the date to the desired format
    const day = date.format('D');
    const month = date.format('MMM');
    const year = date.format('YY');

    // Return the formatted string
    return { "day": day, "month": month.slice(0, -1), "year": year };
}

export default function DemandeCongeDetails({ route, navigation }) {
    let { demande } = route.params;

    const acceptDemande = (id) => {

        Alert.alert(`accepte demande ${id}`);
    }
    const refuseDemande = (id) => {
        Alert.alert(`refuse demande ${id}`);
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>

                {demande.imageUrl ?
                    (<Image source={{ uri: demande.imageUrl }} style={{ width: 50, height: 50, borderRadius: 25 }} />) :
                    (<Image source={require('../../assets/profile.jpeg')} style={{ width: 50, height: 50, borderRadius: 25 }} />)
                }
                <View>
                    <Text style={styles.fullname}>{demande.fullname}</Text>
                    <Text style={styles.user_type}>{demande.user_type}</Text>
                </View>

            </View>
            <View style={styles.box}>
                <View>
                    <Text style={styles.title}>Date(s) et Heurs(s)</Text>
                </View>
                <View style={styles.dateContainer}>
                    <View style={styles.dateView}>
                        <Text style={styles.date}>{formatDate(demande.date_debut).day} {formatDate(demande.date_debut).month}</Text>
                        <View style={{ paddingHorizontal: 5 }}>
                            <Ionicons name="arrow-forward" size={20} color="black" />
                        </View>
                        <Text style={styles.date}>{formatDate(demande.date_fin).day} {formatDate(demande.date_fin).month}</Text>
                    </View>
                    <View style={styles.conge_typeView}>
                        <Text style={styles.conge_type}>{demande.conge_type}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.box}>
                <View>
                    <Text style={styles.title}>Nombre des jours</Text>
                </View>
                <View style={{ paddingVertical: 5 }}>
                    <Text style={styles.label}>{demande.nbr_days} jours</Text>
                </View>
            </View>

            <View style={styles.box2}>
                <Text style={styles.title2}>Etat général</Text>
                <View style={styles.statusView}>
                    <View style={demande.status == "En attente" ? styles.waiting : demande.status == "Accepté" ? styles.accpeted : styles.rejected}></View>
                    <Text style={styles.status}>{demande.status}</Text>
                </View>
            </View>

            {demande.status == "Refusé" && (
                <View style={styles.box2}>
                    <Text style={styles.title2}>Raison du refus</Text>
                    <View style={styles.statusView}>
                        <Text style={styles.status}>{demande.obs}</Text>
                    </View>
                </View>
            )}

            <View style={styles.box2}>
                <Text style={styles.title2}>Date du demande</Text>
                <View style={styles.statusView}>
                    <Text style={styles.status}>{demande.date_demande}</Text>
                </View>
            </View>

            {demande.status == "En attente" && (
                <View style={styles.btns}>
                    <TouchableOpacity style={[styles.btn, styles.btn_accept]} onPress={() => { acceptDemande(demande.id) }}>
                        <Text style={styles.btnText1}>Accepter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn, styles.btn_reject]} onPress={() => { refuseDemande(demande.id) }}>
                        <Text style={styles.btnText2}>Refuser</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    fullname: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 20,
        color: "#4b6aff",
    },
    user_type: {
        fontSize: 16,
        marginLeft: 20,
        color: "#7a7a7a",
    },
    box: {
        flexDirection: "column",
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 16,
        color: "#777",
    },
    dateContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
    },
    dateView: {
        flexDirection: "row",
        alignItems: "center",
    },
    date: {
        fontSize: 20,
        fontWeight: "bold",
    },
    conge_typeView: {
        padding: 5,
        borderRadius: 5,
        borderColor: "#4b6aff",
        borderWidth: 2,
    },
    conge_type: {
        color: "#4b6aff",
        fontSize: 16,
        fontWeight: "bold",
    },
    label: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#555"
    },
    box2: {
        flexDirection: "column",
        marginVertical: 5,
    },
    title2: {
        fontSize: 16,
        color: "#333",
        paddingHorizontal: 10,
        padding: 5,
        fontWeight: "bold",
    },
    statusView: {
        paddingVertical: 10,
        margin: 5,
        borderBottomWidth: 2,
        borderTopWidth: 2,
        borderBottomColor: "#ccc",
        borderTopColor: "#ccc",
        flexDirection: "row"
    },
    status: {
        fontSize: 15,
        paddingLeft: 10,
        color: "#666",
    },
    waiting: {
        backgroundColor: "#FFB300",
        width: 20,
        height: 20,
        borderRadius: 100,
    },
    accpeted: {
        backgroundColor: "#43A047",
        width: 20,
        height: 20,
        borderRadius: 100,
    },
    rejected: {
        backgroundColor: "#F44336",
        width: 20,
        height: 20,
        borderRadius: 100,
    },
    btns: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    btn: {
        padding: 10,
        borderRadius: 5,
        width: "48%",
        alignItems: "center",
        justifyContent: "center",
    },
    btn_accept: {
        backgroundColor: "#4b6aff",
    },
    btn_reject: {
        backgroundColor: "#F44336",
    },
    btnText1: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    btnText2: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    }
});
