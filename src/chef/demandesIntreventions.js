import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, Modal, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useSelector } from 'react-redux';
import { ConfirmAction } from '../components/utils';


export default function DemandesInterventions({ navigation }) {
    const TOKEN = useSelector(state => state.user.token);
    const BASE_URL = useSelector(state => state.baseURL.baseURL);

    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [dateType, setDateType] = useState('');
    const [fromDate, setFromDate] = useState(moment().subtract(1, 'month').format("DD/MM/YYYY"));
    const [toDate, setToDate] = useState(moment().add(7, 'day').format("DD/MM/YYYY"));
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [lieu_prelevement, setLieuPrelevement] = useState('');
    const [selectedTechnician, setSelectedTechnician] = useState('');
    const [selectedPrestation, setSelectedPrestation] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
    const [comment, setComment] = useState('');
    const [selectedIntervention, setSelectedIntervention] = useState(null);
    const [interventions, setInterventions] = useState([]);
    const [reload, setReload] = useState(false);

    const [clients, setClients] = useState(useSelector(state => state.data.clients));
    const [projects, setProjects] = useState(useSelector(state => state.data.projects));
    const [prestations, setPrestations] = useState(useSelector(state => state.data.prestations));
    const [techniciens, setTechniciens] = useState(useSelector(state => state.data.techniciens));

    // get Demandes Interventions
    useEffect(() => {
        fetchData();
    }, [fromDate, toDate, reload]);
    const onRefresh = useCallback(() => {
        fetchData();
    }, [fromDate, toDate, reload]);

    const fetchData = async () => {
        try {
            setRefreshing(true);
            const API_URL = `${BASE_URL}/?page=DemandesInterventions`;
            const fromDateAPI = parseInt(moment(fromDate, "DD/MM/YYYY").format('YYYYMMDD'));
            const toDateAPI = parseInt(moment(toDate, "DD/MM/YYYY").format('YYYYMMDD'));
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "fromDate": fromDateAPI, "toDate": toDateAPI }),
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
                try {
                    if (text[0] == "[" || text[0] == "{") {
                        data = JSON.parse(text);
                    }
                    else {
                        data = [];
                    }
                } catch (error) {
                    console.error('Error  parsing JSON:', error);
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
                // console.log(data);
                setInterventions(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setRefreshing(false);
        }
    };

    // confirme intervention function
    const confirmeIntervention = async () => {
        let API_URL = `${BASE_URL}/?page=ValidateDemandeIntervention`;
        let date = parseInt(moment(selectedDate).format('YYYYMMDD'));
        setRefreshing(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        "technicien_id": selectedTechnician, "projet_id": selectedProject, "date_intervention": date,
                        "IDPhase": selectedPrestation, "intervention_id": selectedIntervention.intervention_id, "Lieux_ouvrage": lieu_prelevement
                    }
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
            if (data.error && data.error == "Expired token") {
                Alert.alert("Un problème est survenu lors de la confirmation de l'intervention");
                navigation.navigate("Déconnexion");
                console.log("Log Out");
                return;
            }
            if (data != null) {
                if (data) {
                    Alert.alert("Intervention  confirmée avec succès");
                    setReload(!reload);
                } else {
                    Alert.alert("Un problème est survenu lors de la confirmation de l'intervention");
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setRefreshing(false);
        }
    };
    // refuser demande intervention function
    const annulateIntervention = async () => {
        let API_URL = `${BASE_URL}/?page=RejectDemandeIntervention`;
        setRefreshing(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    { "obs": comment, "intervention_id": selectedIntervention.intervention_id }
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
            if (data.error && data.error == "Expired token") {
                Alert.alert("Un problème est survenu lors du refus de l'intervention");
                navigation.navigate("Déconnexion");
                console.log("Log Out");
                return;
            }
            if (data != null) {
                if (data) {
                    Alert.alert("Intervention refusée avec succès");
                    setReload(!reload);
                } else {
                    Alert.alert("Un problème est survenu lors du refus de l'intervention");
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setRefreshing(true);
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

    const showDatePicker2 = () => {
        setDatePickerVisibility2(true);
    };

    const hideDatePicker2 = () => {
        setDatePickerVisibility2(false);
    };
    const validateDateRange = (nextDate) => {
        if (fromDate) {
            const fromDateObj = moment(fromDate, "DD/MM/YYYY");
            const toDateObj = moment(nextDate, "DD/MM/YYYY");

            if (fromDateObj.isAfter(toDateObj)) {
                return false;
            }
        }
        return true;
    };
    // Handle date selection
    const handleConfirm = (date) => {
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        if (dateType === 'from') {
            setFromDate(formattedDate);
        } else {
            if (!validateDateRange(formattedDate)) {
                Alert.alert("Plage de dates non valide", "La date  De  doit être antérieure ou égale à la date  À .");
            }
            else {
                setToDate(formattedDate);
            }
        }
        hideDatePicker();
    };

    const handleConfirm2 = (date) => {
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        console.log(formattedDate)
        setSelectedDate(moment(formattedDate, "DD/MM/YYYY"));
        hideDatePicker2();
    };

    const filterInterventions = () => {
        let filteredInterventions = interventions;
        // Convert intervention dates to Date objects
        filteredInterventions = filteredInterventions.filter(intervention => {

            // Filter by search query
            const searchMatch = search === "" ||
                intervention.abr_projet.toLowerCase().includes(search.toLowerCase()) ||
                intervention.abr_client.toLowerCase().includes(search.toLowerCase()) ||
                intervention.Nom_personnel.toLowerCase().includes(search.toLowerCase());


            return searchMatch;
        });

        return filteredInterventions;
    };

    const DemandeClick = (intervention) => {
        setSelectedIntervention(intervention);
        setSelectedClient(intervention.IDClient);
        setSelectedProject(intervention.projet_id);
        setSelectedTechnician(intervention.technicien_id);
        setSelectedPrestation(intervention.IDPhase);
        setLieuPrelevement(intervention.Lieux_ouvrage);
        setSelectedDate(moment(intervention.date_intervention, "YYYYMMDD"));
        setModalVisible(true);
    };

    const handleAddIntervention = () => {
        // Check if inputs are correct
        if (selectedClient === "") {
            Alert.alert("Client est obligatoire");
            return;
        } else if (selectedProject === "") {
            Alert.alert("Projet est obligatoire");
            return;
        } else if (selectedTechnician === "") {
            Alert.alert("Technicien est obligatoire");
            return;
        } else if (selectedPrestation === "") {
            Alert.alert("Prestation est obligatoire");
            return;
        } else if (selectedDate === null) {
            Alert.alert("Date est obligatoire");
            return;
        }

        // Confirm the action
        ConfirmAction(
            "Êtes-vous sûr de vouloir ajouter cette intervention?",
            () => {
                confirmeIntervention();
                setModalVisible(false);
            }
        );
    };

    const handleRemoveIntervention = () => {
        if (comment === '') {
            Alert.alert('Veuillez ajouter un commentaire');
            return;
        }

        // Confirm the action
        ConfirmAction(
            "Êtes-vous sûr de vouloir annuler cette intervention?",
            () => {
                annulateIntervention();
                setComment('');
                setSelectedIntervention(null);
                setModalVisible2(false);
                setModalVisible(false);
            }
        );
    };


    return (
        <View style={{ flex: 1, backgroundColor: "white", position: "relative" }}>

            <View style={styles.searchView}>
                <TextInput placeholder='rechercher' value={search} onChangeText={setSearch}
                    style={styles.searchInput}
                />
                <EvilIcons name="search" size={24} color="black"
                    style={styles.searchIcon}
                />
            </View>

            <View style={styles.DateView}>
                <View style={styles.view}>
                    <TouchableOpacity onPress={() => showDatePicker('from')}>
                        <Fontisto name="date" size={33} color="#0853a1" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.text}>De date</Text>
                        <Text style={styles.textDate}>{fromDate}</Text>
                    </View>
                </View>
                <View style={styles.view}>
                    <TouchableOpacity onPress={() => showDatePicker('to')}>
                        <Fontisto name="date" size={33} color="#0853a1" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.text}>A date</Text>
                        <Text style={styles.textDate}>{toDate}</Text>
                    </View>
                </View>
            </View>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />

            <FlatList
                data={filterInterventions()}
                keyExtractor={(item) => item.intervention_id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.intervention}
                        onPress={() => DemandeClick(item)}
                    >
                        <Text style={styles.Project}>{item.abr_projet}</Text>
                        <Text style={styles.client}>Objet : {item.Objet_Projet}</Text>
                        <Text style={styles.client}>Client : {item.abr_client}</Text>
                        <Text style={styles.technicien}>Technicien: {item.Nom_personnel}</Text>

                        <View style={styles.dateView}>
                            <Text style={styles.dateText}>
                                {moment(item.date_intervention, "YYYYMMDD").format("DD/MM/YYYY") || 'N/A'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                contentContainerStyle={styles.pgm}
            />

            {/* Demande Intervention details */}
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
                        <Text style={styles.modalTitle}>Valider une Intervention</Text>

                        <Text style={styles.label}>Client</Text>
                        <Picker
                            selectedValue={selectedClient}
                            onValueChange={(itemValue, itemIndex) => setSelectedClient(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Séléctionner Client" value="" />
                            {clients ? (
                                clients?.map((client, index) => (
                                    <Picker.Item key={index} label={client.abr_client} value={client.IDClient} />
                                ))) : (
                                <></>
                            )
                            }
                        </Picker>

                        <Text style={styles.label}>Projet</Text>
                        <Picker
                            selectedValue={selectedProject}
                            onValueChange={(itemValue, itemIndex) => setSelectedProject(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Séléctionner Projet" value="" />
                            {projects?.map((project, index) => (
                                <Picker.Item key={index} label={project.abr_projet} value={project.IDProjet} />
                            ))}
                        </Picker>

                        <Text style={styles.label}>Technicien</Text>
                        <Picker
                            selectedValue={selectedTechnician}
                            onValueChange={(itemValue, itemIndex) => setSelectedTechnician(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Séléctionner Technicien" value="" />
                            {techniciens?.map((technician, index) => (
                                <Picker.Item key={index} label={technician.Nom_personnel} value={technician.IDPersonnel} />
                            ))}
                        </Picker>

                        <Text style={styles.label}>Prestation</Text>
                        <Picker
                            selectedValue={selectedPrestation}
                            onValueChange={(itemValue, itemIndex) => setSelectedPrestation(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Séléctionner Prestation" value="" />
                            {prestations?.map((prestation, index) => (
                                <Picker.Item key={index} label={prestation.libelle} value={prestation.IDPhase} />
                            ))}
                        </Picker>

                        <Text style={styles.label}>Lieu de prélévement</Text>
                        <TextInput
                            value={lieu_prelevement}
                            onChangeText={setLieuPrelevement}
                            style={[styles.input]}
                        />

                        <Text style={styles.label}>Date</Text>
                        <TouchableOpacity style={styles.dateButton} onPress={showDatePicker2}>
                            <Text style={styles.dateButtonText}>
                                {selectedDate ? moment(selectedDate).format('MM/DD/YYYY') : 'Séléctionner Date'}
                            </Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible2}
                            mode="date"
                            onConfirm={handleConfirm2}
                            onCancel={hideDatePicker2}
                        />
                        <View style={styles.btns}>
                            <TouchableOpacity style={styles.modalButton} onPress={handleAddIntervention}>
                                <Text style={styles.modalButtonText}>Valider</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButtonRefuse} onPress={() => setModalVisible2(true)}>
                                <Text style={styles.modalButtonText}>Refuser</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Modal for refuse */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible2}
                            onRequestClose={() => {
                                setModalVisible2(!modalVisible2);
                            }}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalView}>
                                    <TouchableOpacity style={styles.close}
                                        onPress={() => setModalVisible2(false)}
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
                                    <TouchableOpacity style={styles.modalButton} onPress={() => { handleRemoveIntervention() }}>
                                        <Text style={styles.modalButtonText}>Valider</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>
            </Modal>


        </View>
    );
}

const styles = StyleSheet.create({
    searchInput: {
        backgroundColor: "#f2f2f2",
        padding: 10,
        marginBottom: 10,
        margin: 10,
        borderRadius: 25,
        paddingHorizontal: 30,
    },
    searchView: {
        position: "relative",
    },
    searchIcon: {
        position: "absolute",
        right: 25,
        top: 24,
    },
    DateView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        paddingHorizontal: 30,
    },
    view: {
        width: "30%",
        flexDirection: "row",
    },
    text: {
        color: "#777",
        fontSize: 13,
        marginLeft: 10,
    },
    textDate: {
        color: "#0853a1",
        fontSize: 14,
        marginLeft: 10,
        fontWeight: "bold",
    },
    pgm: {
        flexGrow: 1,
        padding: 10,
        paddingTop: 0,
    },
    intervention: {
        backgroundColor: '#fff',
        padding: 15,
        marginRight: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    Project: {
        fontWeight: "bold",
        fontSize: 22,
    },
    client: {
        color: "#8d8d8d",
        fontSize: 16,
        fontWeight: "bold",
        paddingLeft: 5,
        marginTop: 5
    },
    technicien: {
        color: "#8d8d8d",
        fontSize: 16,
        fontWeight: "bold",
        paddingLeft: 5,
        marginTop: 5,
        marginBottom: 16,
    },
    interventionText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    itemSeparator: {
        height: 10,
    },
    dateView: {
        position: "absolute",
        bottom: 15,
        right: 15,
    },
    dateText: {
        color: "#777"
    },
    picker: {
        width: '94%',
        paddingHorizontal: 10,
        backgroundColor: "#f2f2f2",
        borderRadius: 25,
    },
    datePickerButton: {
        backgroundColor: "#f2f2f2",
        padding: 10,
        marginBottom: 10,
        margin: 10,
        borderRadius: 25,
        alignItems: 'center',
    },
    datePickerButtonText: {
        color: "#333",
        fontSize: 16,
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
    label: {
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
    input: {
        width: '98%',
        height: 40,
        marginVertical: 10,
        marginBottom: 20,
        paddingHorizontal: 20,
        borderColor: '#ccc',
        borderWidth: 1,

    },
    dateButton: {
        width: '100%',
        height: 50,
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
    btns: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {

        backgroundColor: '#4bacc0',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        width: '48%',
        marginBottom: 10,
    },
    modalButtonRefuse: {
        backgroundColor: 'red',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        width: '48%',
        marginBottom: 10,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
