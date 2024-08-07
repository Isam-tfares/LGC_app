import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { Picker } from '@react-native-picker/picker';

export default function Conge({ navigation }) {

    // State variables for input values
    const [showenSection, setShowenSection] = useState(false);
    const [availableDays, setAvailableDays] = useState(15);
    const [years, setYears] = useState([2022, 2023, 2024]);
    const [year, setYear] = useState(2024);
    const [selectedMotif, setSelectedMotif] = useState('');
    const [autreMotif, setAutreMotif] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [nbr_days, setNbr_days] = useState(0);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateType, setDateType] = useState('');
    const [conges, setConges] = useState([
        { "id": 1, "start_date": "2024-01-01", "end_date": "2024-01-02", "nbr_jrs": 2 },
        { "id": 2, "start_date": "2024-04-03", "end_date": "2024-04-10", "nbr_jrs": 8 },
        { "id": 3, "start_date": "2024-07-01", "end_date": "2024-07-05", "nbr_jrs": 5 },
    ]);
    const [motifs_conges, setMotifsConges] = useState([
        { "id": 1, "motif": "Annuel" },
        { "id": 2, "motif": "Maladie" },
        { "id": 3, "motif": "Mariage" },
        { "id": 4, "motif": "Naissance" },
        { "id": 5, "motif": "Décès" },
        { "id": 6, "motif": "Autre" },
    ]);
    useEffect(() => {
        // Fetch motifs conges from the API
        console.log("Fetching motifs conges from the API");
        // setMotifsConges;
    }, []);
    useEffect(() => {
        console.log("Fetching conges from the API");
        // Fetch available days and conges historique from the API
    }, [year]);




    // Show date picker
    const showDatePicker = (type) => {
        setDateType(type);
        setDatePickerVisibility(true);
    };

    // Hide date picker
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    // Handle date selection
    const handleConfirm = (date) => {
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        if (dateType === 'from') {
            setFromDate(formattedDate);
        } else {
            setToDate(formattedDate);
        }
        hideDatePicker();
    };

    // Handler for submitting the leave request
    const handleRequest = () => {
        // Vérification des champs requis
        if (!selectedMotif || !fromDate || !toDate || !nbr_days) {
            return Alert.alert('Erreur', 'Veuillez remplir tous les champs');
        }

        // Vérification du motif autre
        if (selectedMotif === 6 && !autreMotif) {
            return Alert.alert('Erreur', 'Veuillez entrer le motif');
        }
        // Convertir les dates du format DD/MM/YYYY au format ISO
        const [fromDay, fromMonth, fromYear] = fromDate.split('/').map(Number);
        const [toDay, toMonth, toYear] = toDate.split('/').map(Number);

        const fromDateObj = new Date(fromYear, fromMonth - 1, fromDay);
        const toDateObj = new Date(toYear, toMonth - 1, toDay);

        // Validation des dates
        if (fromDateObj > toDateObj) {
            return Alert.alert('Erreur', 'La date de début doit être avant la date de fin');
        }

        // Affichage des informations pour la demande
        console.log(`Motif: ${selectedMotif}, Autre motif: ${autreMotif}, Date de début: ${fromDate}, Date de fin: ${toDate}, Nombre des jours: ${nbr_days}`);

        // Affichage d'un message de succès
        Alert.alert('Demande de congé', 'Votre demande de congé a été envoyée avec succès');

        // Réinitialisation des champs
        setFromDate('');
        setToDate('');
        setNbr_days(0);
        setSelectedMotif('');
        setAutreMotif('');
    };



    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <View style={styles.infoContainer}>
                        <AntDesign name="calendar" size={20} color="black" backgroundColor="#4b6aff" />
                        <Text style={styles.textInfo}>Période</Text>
                    </View>
                    <View style={styles.valueContainer}>
                        <Picker
                            selectedValue={year}
                            onValueChange={(itemValue, itemIndex) => setYear(itemValue)}
                            style={styles.small_picker}
                        >
                            {years.map((year, index) => (
                                <Picker.Item key={index} label={year.toString()} value={year} />
                            ))}
                        </Picker>
                    </View>
                </View>
                <View style={styles.header}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.textInfo}>Jours restants</Text>
                    </View>
                    <View style={[styles.valueContainer, { height: 50 }]}>
                        <Text style={styles.year2}>{availableDays} jours</Text>
                        <TouchableOpacity onPress={() => setShowenSection(true)}>
                            <MaterialCommunityIcons name="information-outline" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.historiqueContainer}>
                <View style={styles.flexConatiner}>
                    <Text style={styles.title}>Historique Congés</Text>
                    <TouchableOpacity onPress={() => { setShowenSection(!showenSection) }}>
                        {showenSection ? <Entypo name="chevron-thin-up" size={20} color="black" /> : <Entypo name="chevron-thin-down" size={24} color="black" />}
                    </TouchableOpacity>
                </View>
                {showenSection ?
                    (<>
                        {conges.map((item, index) => {
                            return (
                                <View style={styles.conge} key={item.id.toString()}>
                                    <Text style={styles.year}>{item.start_date} -> {item.end_date}</Text>
                                    <Text style={styles.days}>{item.nbr_jrs} Jours</Text>
                                </View>
                            );
                        })}
                    </>) : null}
            </View>
            <Text style={styles.title}>Demande Congé</Text>
            <View style={styles.formContainer}>
                <Text style={styles.label}>Motif de congé</Text>
                <Picker
                    selectedValue={selectedMotif}
                    onValueChange={(itemValue, itemIndex) => setSelectedMotif(itemValue)}
                    style={styles.input}
                >
                    <Picker.Item label="Motif de congé" value="" />
                    {motifs_conges.map((motif, index) => (
                        <Picker.Item key={index} label={motif.motif} value={motif.id} />
                    ))}
                </Picker>
                {selectedMotif === 6 ?
                    (<TextInput
                        style={styles.input}
                        placeholder="Entrer le motif"
                        value={autreMotif}
                        onChangeText={setAutreMotif}
                    />)
                    : null}

                <Text style={styles.label}>Date de début</Text>
                <TouchableOpacity onPress={() => showDatePicker('from')}>
                    <TextInput
                        style={styles.input}
                        placeholder="Date de début"
                        value={fromDate}
                        editable={false}
                    />
                </TouchableOpacity>

                <Text style={styles.label}>Date de fin</Text>
                <TouchableOpacity onPress={() => showDatePicker('to')}>
                    <TextInput
                        style={styles.input}
                        placeholder="Date de fin"
                        value={toDate}
                        editable={false}
                    />
                </TouchableOpacity>

                <Text style={styles.label}>Nombre des jours</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre des jours"
                    value={nbr_days.toString()}
                    onChangeText={(text) => setNbr_days(parseInt(text, 10))}
                    keyboardType="numeric"
                />

                <TouchableOpacity style={styles.button} onPress={handleRequest}>
                    <Text style={styles.buttonText}>Demander</Text>
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
    header: {
        padding: 10,
        width: '48%',
        borderColor: "#4b6aff",
        borderWidth: 1,
        borderRadius: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerContainer: {
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    infoContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 5,
    },
    valueContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    textInfo: {
        paddingLeft: 5,
        fontWeight: "bold",
        fontSize: 18,

    },
    year2: {
        fontSize: 16,
    },
    year: {
        fontSize: 20,
        fontWeight: "bold",
    },
    historiqueContainer: {
        marginBottom: 20,
    },
    flexConatiner: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    small_picker: {
        width: 165,
        fontWeight: "bold",
        height: 50,
        marginBottom: 5,
    },
    conge: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,

    },
    days: {
        color: "#4b6aff",
        paddingTop: 7,
        fontSize: 16,
    },
    label: {
        width: '100%',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: "#333",
    },
    picker: {
        width: '100%',
        height: 50,
        marginBottom: 20,
    },
    labelText: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: "bold",
        color: "#d7dff9",
    },
    formContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        paddingBottom: 20,
        marginBottom: 20,
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
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: {
        fontWeight: "bold",
        fontSize: 25,
        paddingBottom: 10
    }
});

