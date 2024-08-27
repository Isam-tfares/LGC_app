import React, { useEffect, useState } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { setData } from '../actions/dataActions';
import { ConfirmAction } from '../components/utils';

export default function AddIntervention({ modalVisible, setModalVisible }) {
    const TOKEN = useSelector(state => state.user.token);
    const dispatch = useDispatch();
    const [clients, setClients] = useState(useSelector(state => state.data.clients));
    const [projects, setProjects] = useState(useSelector(state => state.data.projects));
    const [projectsPicker, setProjectsPicker] = useState([]);
    const [prestations, setPrestations] = useState(useSelector(state => state.data.prestations));
    const [techniciens, setTechniciens] = useState(useSelector(state => state.data.techniciens));

    const [selectedClient, setSelectedClient] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedTechnician, setSelectedTechnician] = useState('');
    const [selectedPrestation, setSelectedPrestation] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    useEffect(() => {
        getData();
    }, []);
    // filter projects that part of clientSelected
    useEffect(() => {
        if (selectedClient && projects) {
            const filteredProjects = projects.filter(project => project.IDClient === selectedClient);
            setProjectsPicker(filteredProjects);
        } else {
            setProjectsPicker([]);
        }
    }, [selectedClient, projects]);

    const getData = () => {
        if (!clients || !projects || !prestations || !techniciens) {
            const API_URL = 'http://192.168.43.88/LGC_backend/?page=addInterventionInterface';
            fetchData(API_URL, TOKEN);
        }
    }

    const fetchData = async (url, token) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
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
                navigation.navigate("Déconnexion");
                console.log("Log Out");
                return;
            }
            if (Object.keys(data)) {
                setTechniciens(data.techniciens);
                setClients(data.clients);
                setProjects(data.projects);
                setPrestations(data.phases);
                dispatch(setData(data.clients, data.projects, data.phases, data.techniciens));

            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const insertIntervention = async (url, token, date) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    { "technicien_id": selectedTechnician, "projet_id": selectedProject, "client_id": selectedClient, "date_intervention": date, "IDPhase": selectedPrestation }
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
                Alert.alert("Un problème est survenu lors de l'ajout de l'intervention");
                navigation.navigate("Déconnexion");
                console.log("Log Out");
                return;
            }
            if (data != null) {
                if (data) {
                    Alert.alert("Intervention ajoutée avec succès");
                } else {
                    Alert.alert("Un problème est survenu lors de l'ajout de l'intervention");
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setSelectedDate(date);
        hideDatePicker();
    };


    const handleAddIntervention = () => {
        ConfirmAction(
            "Êtes-vous sûr de vouloir ajouter cette intervention?",
            () => {
                // Check if inputs are correct
                if (!selectedClient || !selectedProject || !selectedTechnician || !selectedPrestation || !selectedDate) {
                    Alert.alert('Erreur', 'Veuillez remplir tous les champs');
                    return;
                }

                const API_URL = "http://192.168.43.88/LGC_backend/?page=AddIntervention";
                const date = parseInt(moment(selectedDate).format('YYYYMMDD'));
                insertIntervention(API_URL, TOKEN, date);

                // Reset the values
                setSelectedClient('');
                setSelectedDate(null);
                setSelectedPrestation('');
                setSelectedProject('');
                setSelectedTechnician('');

                setModalVisible(false);
            }
        );
    };


    const closeModal = () => {
        setSelectedClient('');
        setSelectedProject('');
        setSelectedPrestation('');
        setSelectedDate(null);
        setModalVisible(false);
        setDatePickerVisibility(false);
        setSelectedTechnician('');
    }

    return (
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
                    <Text style={styles.modalTitle}>Ajouter une Intervention</Text>

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
                        onValueChange={(itemValue) => setSelectedProject(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Séléctionner Projet" value="" />
                        {selectedClient ? (
                            projectsPicker.length > 0 ? (
                                projectsPicker.map((project, index) => (
                                    <Picker.Item
                                        key={index}
                                        label={project.abr_projet || "Nom du projet inconnu"}
                                        value={project.IDProjet || ""}
                                    />
                                ))
                            ) : (
                                <Picker.Item label="Aucun projet disponible" value="" />
                            )
                        ) : (
                            <Picker.Item label="Séléctionner client d'abord" value="" />
                        )}
                    </Picker>

                    <Text style={styles.label}>Technicien</Text>
                    <Picker
                        selectedValue={selectedTechnician}
                        onValueChange={(itemValue, itemIndex) => setSelectedTechnician(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Séléctionner Technicien" value="" />
                        {techniciens?.map((technician, index) => (
                            <Picker.Item key={index} label={technician.Nom_personnel} value={technician.user_id} />
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

                    <Text style={styles.label}>Date</Text>
                    <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
                        <Text style={styles.dateButtonText}>
                            {selectedDate ? moment(selectedDate).format('MM/DD/YYYY') : 'Séléctionner Date'}
                        </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    />

                    <TouchableOpacity style={styles.modalButton} onPress={handleAddIntervention}>
                        <Text style={styles.modalButtonText}>Ajouter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
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
