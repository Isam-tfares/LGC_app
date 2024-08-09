import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, Modal, TextInput } from 'react-native';
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
    const [modalVisible, setModalVisible] = useState(false);
    const [comment, setComment] = useState('');
    const acceptDemande = () => {

        Alert.alert(`accepte demande ${demande.id}`);
    }
    const refuseDemande = () => {
        if (comment === '') {
            Alert.alert('Veuillez ajouter un commentaire');
            return;
        }
        setModalVisible(false);
        Alert.alert('Refuser demande ' + demande.id, 'Comment: ' + comment);
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
                    <TouchableOpacity style={[styles.btn, styles.btn_accept]} onPress={() => { acceptDemande() }}>
                        <Text style={styles.btnText1}>Accepter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn, styles.btn_reject]} onPress={() => { setModalVisible(true) }}>
                        <Text style={styles.btnText2}>Refuser</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Modal for refuse */}
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
                            placeholder="Cause de refus"
                            value={comment}
                            onChangeText={setComment}
                            placeholderTextColor="#aaa"
                        />
                        <TouchableOpacity style={styles.modalButton} onPress={() => { refuseDemande() }}>
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
    },
    // Modal
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
    close: {
        position: "absolute",
        top: -15,
        right: -15,
    },
});
