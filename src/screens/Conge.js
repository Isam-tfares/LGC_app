import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, RefreshControl } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import 'moment/locale/fr'; // Import French locale for month names
import { useSelector } from 'react-redux';

export default function Conge({ navigation }) {
    const TOKEN = useSelector(state => state.user.token);

    // State variables for input values
    const [refreshing, setRefreshing] = useState(false);
    const [showenSection, setShowenSection] = useState(false);
    const [showenSection2, setShowenSection2] = useState(false);
    const [availableDays, setAvailableDays] = useState(15);
    const [years, setYears] = useState();
    const [year, setYear] = useState(moment().year());
    const [selectedMotif, setSelectedMotif] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [fromDateAPI, setFromDateAPI] = useState('');
    const [toDateAPI, setToDateAPI] = useState('');
    const [nbr_days, setNbr_days] = useState(0);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateType, setDateType] = useState('');
    const [conges, setConges] = useState([]);
    const [demandesConges, setDemandesConges] = useState([]);
    const [motifs_conges, setMotifsConges] = useState([]);
    const [reload, setReload] = useState(false);


    useEffect(() => {
        fetchData();
    }, [year, reload]);
    const onRefresh = useCallback(() => {
        fetchData();
    }, [year, reload]);

    const fetchData = async () => {
        try {
            setRefreshing(true);
            const API_URL = 'http://192.168.43.88/LGC_backend/?page=CongesInterface';
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "year": year }),
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
                setConges(data.conges);
                setMotifsConges(data.motifs);
                setAvailableDays(data.days);
                setYears(data.years);
                setDemandesConges(data.demandesConges);
            }
        } catch (error) {
            console.error(' Error fetching data:', error);
        }
        finally {
            setRefreshing(false);
        }
    };

    // confirme intervention function
    const addDemandeConge = async () => {
        let API_URL = 'http://192.168.43.88/LGC_backend/?page=AddDemandeConge';
        setRefreshing(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    { "fromDate": fromDateAPI, "toDate": toDateAPI, "year": moment().year(), "nbr_days": nbr_days, "motifsconge_id": selectedMotif }
                )
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
                if (data) {
                    Alert.alert("Demande ajoutée avec succès");
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
            const fromDateObj = moment(formattedDate, "DD/MM/YYYY");
            const fromDateAPIFormat = fromDateObj.format("YYYYMMDD");
            setFromDateAPI(parseInt(fromDateAPIFormat, 10));
        } else {
            setToDate(formattedDate);
            const toDateObj = moment(formattedDate, "DD/MM/YYYY");
            const toDateAPIFormat = toDateObj.format("YYYYMMDD");
            setToDateAPI(parseInt(toDateAPIFormat, 10));
        }
        hideDatePicker();
    };

    // Handler for submitting the leave request
    const handleRequest = () => {
        // Vérification des champs requis
        if (!selectedMotif || !fromDate || !toDate || !nbr_days) {
            return Alert.alert('Erreur', 'Veuillez remplir tous les champs');
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
        // check if nbr_days in integer
        if (!Number.isInteger(nbr_days)) {
            return Alert.alert('Erreur', 'Le nombre de jours doit être un entier');
        }
        if (nbr_days > availableDays) {
            return Alert.alert('Erreur', 'Vous avez dépassé le nombre de jours restants');
        }
        addDemandeConge();
        // Réinitialisation des champs
        setFromDate('');
        setToDate('');
        setNbr_days(0);
        setSelectedMotif('');
        setReload(!reload);
    };



    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />}
            contentContainerStyle={styles.container}>
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
                            {years?.map((year, index) => (
                                <Picker.Item key={index} label={year.annee} value={year.annee} />
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
                        {conges?.map((item, index) => {
                            return (
                                <View style={styles.conge} key={item.conge_id}>
                                    <Text style={styles.year}>{moment(item.start_date, "YYYYMMDD").format("DD/MM/YYYY") || 'N/A'} -> {moment(item.end_date, "YYYYMMDD").format("DD/MM/YYYY") || 'N/A'}</Text>
                                    <Text style={styles.days}>{item.jours_pris} Jours</Text>
                                </View>
                            );
                        })}
                    </>) : null}
            </View>
            <View style={styles.historiqueContainer}>
                <View style={styles.flexConatiner}>
                    <Text style={styles.title}>Vos Demandes</Text>
                    <TouchableOpacity onPress={() => { setShowenSection2(!showenSection2) }}>
                        {showenSection2 ? <Entypo name="chevron-thin-up" size={20} color="black" /> : <Entypo name="chevron-thin-down" size={24} color="black" />}
                    </TouchableOpacity>
                </View>
                {showenSection2 ?
                    (<>
                        {demandesConges?.map((item, index) => {
                            return (
                                <View style={styles.conge} key={item.conge_id}>
                                    <Text style={styles.year}>{moment(item.start_date, "YYYYMMDD").format("DD/MM/YYYY") || 'N/A'} -> {moment(item.end_date, "YYYYMMDD").format("DD/MM/YYYY") || 'N/A'}</Text>
                                    <Text style={styles.days}>{item.jours_pris} Jours</Text>
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
                    {motifs_conges?.map((motif, index) => (
                        <Picker.Item key={index} label={motif.labelle} value={motif.motifsconge_id} />
                    ))}
                </Picker>

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
                    onChangeText={(text) => { setNbr_days(parseInt(text)) }}
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
    },
    loading: {
        position: "absolute",
        top: "50%",
        left: "50%",
        zIndex: 111
    }
});

