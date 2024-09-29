import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, RefreshControl, Modal } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import 'moment/locale/fr'; // Import French locale for month names
import { useSelector } from 'react-redux';
import { ConfirmAction } from '../components/utils';

function formatDate(inputDate) {
    // Parse the date using moment
    const date = moment(inputDate, "YYYYMMDD")

    // Format the date to the desired format
    const day = date.format('D');
    const month = date.format('MMM');
    const year = date.format('YY');

    // Return the formatted string
    return { "day": day, "month": month, "year": year };
}
export default function Conge({ navigation }) {
    const TOKEN = useSelector(state => state.user.token);
    const BASE_URL = useSelector(state => state.baseURL.baseURL);

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
    const [obs, setObs] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateType, setDateType] = useState('');
    const [conges, setConges] = useState([]);
    const [demandesConges, setDemandesConges] = useState([]);
    const [demandesRefus, setDemandesRefus] = useState([]);
    const [motifs_conges, setMotifsConges] = useState([]);
    const [reload, setReload] = useState(false);
    const [clicked, setClicked] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchData();
    }, [year, reload]);
    const onRefresh = useCallback(() => {
        fetchData();
    }, [year, reload]);

    const fetchData = async () => {
        try {
            setRefreshing(true);
            const API_URL = `${BASE_URL}/?page=CongesInterface`;
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
                setDemandesConges(data.demandesConges);
                setDemandesRefus(data.demandesRefus);
                if (data.years.length == 0) {
                    setYears([{ "annee": moment().year() }]);
                } else {
                    setYears(data.years);
                }
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
        let API_URL = `${BASE_URL}/?page=AddDemandeConge`;
        setRefreshing(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    { "fromDate": fromDateAPI, "toDate": toDateAPI, "year": moment().year(), "nbr_days": nbr_days, "motifsconge_id": selectedMotif, "obs": obs }
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

        // Convertir nbr_days en entier avant de faire la validation
        const days = parseInt(nbr_days, 10);  // Convertir en entier

        // Vérification si nbr_days est un entier
        if (!Number.isInteger(days) || days <= 0) {
            return Alert.alert('Erreur', 'Le nombre de jours doit être un entier positif');
        }

        // Définir nbr_days comme un entier dans l'état
        setNbr_days(days);

        // Confirmation de l'action avant d'ajouter la demande
        ConfirmAction(
            "Êtes-vous sûr de vouloir soumettre cette demande de congé?",
            () => {
                addDemandeConge();

                // Réinitialisation des champs
                setFromDate('');
                setToDate('');
                setNbr_days(0);
                setSelectedMotif('');
                setModalVisible(false);
                setReload(!reload);
            }
        );
    };

    const closeModal = () => {
        setFromDate('');
        setToDate('');
        setNbr_days(0);
        setSelectedMotif('');
        setObs('');
        setModalVisible(false);
    }
    const filterConges = () => {
        if (clicked == 1) {
            return demandesConges;
        } else if (clicked == 2) {
            return conges;
        } else {
            return demandesRefus;
        }
    }



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

            <View style={styles.btnView}>
                <TouchableOpacity style={styles.btn} onPress={() => { setModalVisible(true) }}>
                    <Text style={styles.btnText}>Demander Congé</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.historiqueContainer}>
                <View style={styles.flexConatiner}>
                    <Text style={styles.title}>Vos Demandes</Text>
                </View>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => { setClicked(1) }} style={styles.liView}>
                        <Text style={[styles.liText, clicked == 1 ? styles.clicked : {}]}>En attente</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setClicked(2) }} style={styles.liView}>
                        <Text style={[styles.liText, clicked == 2 ? styles.clicked : {}]}>Acceptés</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setClicked(3) }} style={styles.liView}>
                        <Text style={[styles.liText, clicked == 3 ? styles.clicked : {}]}>Refusés</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.demandesView}>
                    {filterConges()?.map((conge, index) => (
                        <View style={styles.conge} key={conge.IDConge_personnel}>
                            <View style={[styles.box, { width: "60%", }]}>
                                <View style={{ width: "90%" }}>
                                    <Text style={styles.textInfo}>{conge.Nat_conge}</Text>
                                    <Text style={styles.labelle}>{conge.Nbj_ouvrable} jour(s)</Text>
                                </View>
                            </View>
                            <View style={[styles.box, { width: "40%" }]}>
                                <View style={styles.dateView}>
                                    <Text style={styles.day}>{formatDate(conge.date_debut).day}</Text>
                                    <Text style={styles.monthyear}>{formatDate(conge.date_debut).month} {formatDate(conge.date_debut).year}</Text>
                                </View>
                                <View style={{ width: "20%" }}>
                                    <Ionicons name="arrow-forward" size={24} color="#888" />
                                </View>
                                <View style={styles.dateView}>
                                    <Text style={styles.day}>{formatDate(conge.date_fin).day}</Text>
                                    <Text style={styles.monthyear}>{formatDate(conge.date_fin).month} {formatDate(conge.date_fin).year}</Text>
                                </View>
                            </View>

                        </View>
                    ))}
                </View>

            </View>

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
                            onPress={() => closeModal()}
                        >
                            <Ionicons name="close-circle-sharp" size={40} color="red" />
                        </TouchableOpacity>

                        <Text style={styles.label2}>Motif de congé</Text>
                        <Picker
                            selectedValue={selectedMotif}
                            onValueChange={(itemValue, itemIndex) => setSelectedMotif(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Motif de congé" value="" />
                            {motifs_conges?.map((motif, index) => (
                                <Picker.Item key={index} label={motif.Nat_conge} value={motif.IDNature_conge} />
                            ))}
                        </Picker>

                        <Text style={styles.label2}>Date de début</Text>
                        <TouchableOpacity style={styles.dateButton} onPress={() => showDatePicker('from')}>
                            <TextInput
                                style={styles.dateButtonText}
                                placeholder="Date de début"
                                value={fromDate}
                                editable={false}
                            />
                        </TouchableOpacity>

                        <Text style={styles.label2}>Date de fin</Text>
                        <TouchableOpacity style={styles.dateButton} onPress={() => showDatePicker('to')}>
                            <TextInput
                                style={styles.dateButtonText}
                                placeholder="Date de fin"
                                value={toDate}
                                editable={false}
                            />
                        </TouchableOpacity>

                        <Text style={styles.label2}>Nombre des jours</Text>
                        <TextInput
                            style={styles.prelevement}
                            placeholder="Nombre des jours"
                            value={nbr_days.toString()}
                            onChangeText={(text) => { setNbr_days(text) }}
                            keyboardType="numeric"
                        />
                        <Text style={styles.label2}>Observation</Text>
                        <TextInput
                            style={styles.prelevement}
                            placeholder="Observation"
                            value={obs}
                            onChangeText={setObs}
                        />

                        <TouchableOpacity style={styles.modalButton} onPress={handleRequest}>
                            <Text style={styles.modalButtonText}>Demander</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>


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
    picker: {
        width: '100%',
        height: 50,
        marginBottom: 20,
    },
    title: {
        fontWeight: "bold",
        fontSize: 25,
        paddingBottom: 10,
        textAlign: "center"
    },
    labelle: {
        fontSize: 14
    },
    headerContainer: {
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    liView: {
        width: "33.3%",
        alignItems: "center",
    },
    liText: {
        fontSize: 18,
        fontWeight: "bold",
        padding: 5,
        paddingBottom: 10,
    },
    clicked: {
        borderBottomColor: "#4b6aff",
        borderBottomWidth: 2,
    },

    conge: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
    },
    box: {
        flexDirection: "row",
        alignItems: "center",
    },
    dateView: {
        flexDirection: "column",
        alignItems: "center",
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 3,
        width: "40%"
    },
    textInfo: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },
    labelle: {
        fontSize: 14,
        marginLeft: 10,
        color: "#7a7a7a",
    },
    demandesView: {
        marginBottom: 30,
        paddingBottom: 30,
    },
    day: {
        fontSize: 16,
        fontWeight: "bold",
    },
    monthyear: {
        fontSize: 12,
        color: "#7a7a7a",
    },
    btnView: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10
    },
    btn: {
        width: 160,
        padding: 10,
        backgroundColor: "#4b6aff"
    },
    btnText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    close: {
        position: "absolute",
        top: -15,
        right: -15,
    },
    modalView: {
        position: "relative",
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
    label2: {
        width: '100%',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    picker: {
        width: '100%',
        height: 50,
        marginBottom: 20,
    },
    prelevement: {
        width: '100%',
        height: 40,
        marginBottom: 20,
        backgroundColor: "#f0f0f0",
        paddingLeft: 10,
        borderRadius: 5,
    },
    dateButton: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginBottom: 20,
    },
    dateButtonText: {
        fontSize: 16,
        color: '#333',
    },
    modalButton: {
        backgroundColor: '#4bacc0',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

