import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, RefreshControl, FlatList } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Entypo from '@expo/vector-icons/Entypo';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import 'moment/locale/fr'; // Import French locale for month names
import { useSelector } from 'react-redux';

export default function NoteFrais({ navigation }) {
    const TOKEN = useSelector(state => state.user.token);

    // State variables for input values
    const [refreshing, setRefreshing] = useState(false);
    const [showenSection, setShowenSection] = useState(false);
    const [selectedTypeCharge, setSelectedTypeCharge] = useState('');
    const [DateNote, setDateNote] = useState('');
    const [DateNoteAPI, setNoteDateAPI] = useState('');
    const [montant, setMontant] = useState("");
    const [Observation, setObservation] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [demandes, setDemandes] = useState([]);
    const [types_charge, setTypes_charge] = useState([]);
    const [reload, setReload] = useState(false);
    const [allNotes, setAllNotes] = useState([]);

    useEffect(() => {
        fetchData();
    }, [reload]);

    const onRefresh = useCallback(() => {
        fetchData();
    }, [reload]);

    const fetchData = async () => {
        try {
            setRefreshing(true);
            const API_URL = 'http://192.168.43.88/LGC_backend/?page=NoteFraisInterface';
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error(` HTTP error! Status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                try {
                    if (text[0] == "[" || text[0] == "{") {
                        data = JSON.parse(text);
                    }
                    else {
                        data = [];
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    // Handle non-JSON data if necessary
                    return;
                }
            }
            if (data.error && data.error == "Expired token") {
                navigation.navigate("Déconnexion");
                console.log("Log Out");
                return;
            }
            if (data) {
                setDemandes(data.demandes);
                setTypes_charge(data.types_charges);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setRefreshing(false);
        }
    };

    const addNoteFrais = async () => {
        let API_URL = 'http://192.168.43.88/LGC_backend/?page=addNoteFrais';
        setRefreshing(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(allNotes)
            });

            if (!response.ok) {
                throw new Error(` HTTP error! Status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                data = JSON.parse(text);
            }
            if (data.error && data.error == "Expired token") {
                Alert.alert("Un problème est survenu lors de l'ajout de la demande");
                navigation.navigate("Déconnexion");
                console.log("Log Out");
                return;
            }
            if (data != null) {
                if (data["success"]) {
                    Alert.alert("Demande ajoutée avec succès");
                    setAllNotes([]);
                    setReload(!reload);
                } else {
                    Alert.alert("Un problème est survenu lors de l'ajout de la demande");
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setRefreshing(false);
        }
    };

    // Show date picker
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    // Hide date picker
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    // Handle date selection
    const handleConfirm = (date) => {
        const formattedDate = moment(date).format("DD/MM/YYYY");
        setDateNote(formattedDate);
        const noteDateAPIFormat = moment(date).format("YYYYMMDD");
        setNoteDateAPI(parseInt(noteDateAPIFormat, 10));

        hideDatePicker();
    };

    const addNote = () => {
        if (!selectedTypeCharge || !DateNote || !montant) {
            return Alert.alert('Erreur', 'Veuillez remplir tous les champs');
        }

        // Convert montant to a number
        const montantNumber = parseFloat(montant);
        if (isNaN(montantNumber)) {
            return Alert.alert('Erreur', 'Le montant doit être un nombre');
        }

        const newNote = { typecharge: selectedTypeCharge, date: DateNoteAPI, montant: montantNumber, observation: Observation };
        setAllNotes([...allNotes, newNote]);

        // Reset the form
        setSelectedTypeCharge('');
        setDateNote('');
        setMontant('');
        setObservation('');
    };

    // Handler for submitting the leave request
    const handleRequest = () => {
        if (allNotes.length == 0) {
            Alert.alert('Ajouter des notes');
            return;
        }
        addNoteFrais();
    };

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />}
            contentContainerStyle={styles.container}
        >
            <View style={styles.historiqueContainer}>
                <View style={styles.flexContainer}>
                    <Text style={styles.title}>Vos Demandes</Text>
                    <TouchableOpacity onPress={() => { setShowenSection(!showenSection) }}>
                        {showenSection ? <Entypo name="chevron-thin-up" size={20} color="black" /> : <Entypo name="chevron-thin-down" size={24} color="black" />}
                    </TouchableOpacity>
                </View>
                {showenSection &&
                    demandes?.map(item => {
                        return (
                            <View key={item.IDNote} style={styles.demandeContainer}>
                                <View style={styles.demandeHeader}>
                                    <Text style={styles.demandeTitle}>Demande ID: {item.IDNote}</Text>
                                    <Text style={styles.demandeStatus}>Statut: {item.statut === "2" ? 'Approuvé' : item.statut === "1" ? 'En attente' : 'Refusée'}</Text>
                                </View>
                                <Text style={styles.demandeMontant}>Montant Total: {item.montant_total} DH</Text>
                                {item.articles?.map(article => {
                                    return (
                                        <View key={article.IDArticle} style={styles.articleContainer}>
                                            <Text style={styles.articleLabel}>Type: {article.libelle}</Text>
                                            <Text style={styles.articleDate}>Date: {moment(article.date_frais, "YYYYMMDD").format("DD/MM/YYYY")}</Text>
                                            <Text style={styles.articleMontant}>Montant: {article.montant} DH</Text>
                                            <Text style={styles.articleObservation}>Observation: {article.observation || 'Aucune'}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        );
                    })
                }

            </View>

            <Text style={styles.title}>Nouvelle note de frais</Text>
            <View style={styles.formContainer}>
                <Text style={styles.label}>Type de charge</Text>
                <Picker
                    selectedValue={selectedTypeCharge}
                    onValueChange={(itemValue) => setSelectedTypeCharge(itemValue)}
                    style={styles.input}
                >
                    <Picker.Item label="Type de charge" value="" />
                    {types_charge?.map((type, index) => (
                        <Picker.Item key={index} label={type.libelle} value={type.IDType} />
                    ))}
                </Picker>

                <Text style={styles.label}>Montant</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Montant"
                    value={montant}
                    onChangeText={(text) => setMontant(text)}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Date de note</Text>
                <TouchableOpacity onPress={showDatePicker}>
                    <TextInput
                        style={styles.input}
                        placeholder="Date"
                        value={DateNote}
                        editable={false}
                    />
                </TouchableOpacity>

                <Text style={styles.label}>Observation</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Observation"
                    value={Observation}
                    onChangeText={setObservation}
                />

                <TouchableOpacity style={styles.button} onPress={addNote}>
                    <Text style={styles.buttonText}>Ajouter</Text>
                </TouchableOpacity>

                <View style={styles.notesContainer}>
                    <Text style={styles.notesTitle}>Notes</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableHeaderText}>Type</Text>
                            <Text style={styles.tableHeaderText}>Date</Text>
                            <Text style={styles.tableHeaderText}>Montant</Text>
                            <Text style={styles.tableHeaderText}>Observation</Text>
                        </View>
                        {allNotes?.map((note, index) => (
                            <View style={styles.tableRow} key={index}>
                                <Text style={styles.tableCell}>{note.typecharge}</Text>
                                <Text style={styles.tableCell}>{note.date}</Text>
                                <Text style={styles.tableCell}>{note.montant}</Text>
                                <Text style={styles.tableCell}>{note.observation}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleRequest}>
                    <Text style={styles.buttonText}>Soumettre</Text>
                </TouchableOpacity>
            </View>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    formContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        paddingBottom: 20,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: "#333",
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 10,
        backgroundColor: '#f2f2f2',
    },
    button: {
        backgroundColor: '#4b6aff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: {
        fontWeight: "bold",
        fontSize: 25,
        paddingBottom: 10,
    },
    notesContainer: {
        marginTop: 20,
    },
    notesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    table: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    tableHeader: {
        backgroundColor: '#DCDCDC',
        flexDirection: 'row',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tableHeaderText: {
        flex: 1,
        fontWeight: 'bold',
        padding: 5,
        textAlign: 'center',
    },
    tableCell: {
        flex: 1,
        padding: 5,
        textAlign: 'center',
    },
    historiqueContainer: {
        marginBottom: 20,
    },
    flexContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontWeight: "bold",
        fontSize: 25,
        paddingBottom: 10,
    },
    demandeContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
    },
    demandeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    demandeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    demandeStatus: {
        fontSize: 16,
        color: '#4CAF50', // green for approved
    },
    demandeDate: {
        fontSize: 16,
    },
    demandeMontant: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    articleContainer: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    articleLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    articleDate: {
        fontSize: 16,
    },
    articleMontant: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    articleObservation: {
        fontSize: 16,
        color: '#555',
    },
});
