import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function DemandesInterventions({ navigation }) {
    const [search, setSearch] = useState("");
    const [dateType, setDateType] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [adresse, setAdresse] = useState('');
    const [selectedTechnician, setSelectedTechnician] = useState('');
    const [selectedPrestation, setSelectedPrestation] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [comment, setComment] = useState('');
    const [selectedIntervention, setSelectedIntervention] = useState(null);
    const [interventions, setInterventions] = useState([
        { id: 1, client: 'Client 1', projet: 'Projet 1', object: "Objet 1", adresse: 'Adresse 1', technicien: "Technicien 1", date: "07/08/2024", prestation: 'Prestation 1' },
        { id: 2, client: 'Client 2', projet: 'Projet 2', object: "Objet 2", adresse: 'Adresse 2', technicien: "Technicien 2", date: "07/08/2024", prestation: 'Prestation 2' },
        { id: 3, client: 'Client 3', projet: 'Projet 3', object: "Objet 3", adresse: 'Adresse 3', technicien: "Technicien 3", date: "07/08/2024", prestation: 'Prestation 3' },
        { id: 4, client: 'Client 4', projet: 'Projet 4', object: "Objet 4", adresse: 'Adresse 4', technicien: "Technicien 4", date: "08/08/2024", prestation: 'Prestation 4' },
        { id: 5, client: 'Client 5', projet: 'Projet 5', object: "Objet 5", adresse: 'Adresse 5', technicien: "Technicien 5", date: "08/08/2024", prestation: 'Prestation 5' },
        { id: 6, client: 'Client 6', projet: 'Projet 6', object: "Objet 6", adresse: 'Adresse 6', technicien: "Technicien 6", date: "08/08/2024", prestation: 'Prestation 6' },
    ]);
    const clients = ["Client 1", "Client 2", "Client 3", "Client 4", "Client 5"];
    const projects = ["Projet 1", "Projet 2", "Projet 3", "Projet 4", "Projet 5"];
    // const objects = ["Objet 1", "Objet 2", "Objet 3", "Objet 4", "Objet 5", "Objet 6", "Objet 7", "Objet 8", "Objet 9", "Objet 10"];
    const prestations = ["Prestation 1", "Prestation 2", "Prestation 3", "Prestation 4", "Prestation 5", "Prestation 6", "Prestation 7", "Prestation 8", "Prestation 9", "Prestation 10"];
    const techniciens = ["Technicien 1", "Technicien 2", "Technicien 3", "Technicien 4", "Technicien 5"];
    // Initialize dates
    useEffect(() => {
        // Initialize dates
        // const today = moment().format("DD/MM/YYYY");
        const secondDate = moment().add(7, 'day').format("DD/MM/YYYY");
        const firstDate = moment().subtract(7, 'day').format("DD/MM/YYYY");

        setFromDate(firstDate);
        setToDate(secondDate);
    }, []);
    // Show date picker
    const showDatePicker = (type) => {
        setDateType(type);
        setDatePickerVisibility(true);
    };

    // Hide date picker
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
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

    const filterInterventions = () => {
        let filteredInterventions = interventions;

        // Convert fromDate and toDate to Date objects
        const fromDateObj = fromDate ? moment(fromDate, "DD/MM/YYYY").toDate() : null;
        const toDateObj = toDate ? moment(toDate, "DD/MM/YYYY").toDate() : null;

        // Convert intervention dates to Date objects
        filteredInterventions = filteredInterventions.filter(intervention => {
            const interventionDate = moment(intervention.date, "DD/MM/YYYY").toDate();

            // Filter by search query
            const searchMatch = search === "" ||
                intervention.projet.toLowerCase().includes(search.toLowerCase()) ||
                intervention.client.toLowerCase().includes(search.toLowerCase()) ||
                intervention.technicien.toLowerCase().includes(search.toLowerCase());

            // Filter by date range
            const dateMatch = (!fromDateObj || interventionDate >= fromDateObj) &&
                (!toDateObj || interventionDate <= toDateObj);

            return searchMatch && dateMatch;
        });

        return filteredInterventions;
    };

    const DemandeClick = (intervention) => {
        setSelectedIntervention(intervention);
        setSelectedClient(intervention.client);
        setSelectedProject(intervention.projet);
        setSelectedTechnician(intervention.technicien);
        setSelectedPrestation(intervention.prestation);
        setAdresse(intervention.adresse);
        setSelectedDate(moment(intervention.date, "DD/MM/YYYY").toDate());
        setModalVisible(true);
    };

    const handleAddIntervention = () => {
        if (selectedClient === "") {
            Alert.alert("Client est obligatoire");
            return;
        } else if (selectedProject === "") {
            Alert.alert("Projet est obligatoire");
            return;
        }
        else if (selectedTechnician === "") {
            Alert.alert("Technicien est obligatoire");
            return;
        }
        else if (selectedPrestation === "") {
            Alert.alert("Prestation est obligatoire");
            return;
        }
        else if (selectedDate === null) {
            Alert.alert("Date est obligatoire");
            return;
        }
        Alert.alert('Intervention ajoutée ',
            `Client: ${selectedClient}\nProject: ${selectedProject}\nTechnician: ${selectedTechnician}\nPrestation: ${selectedPrestation}\nDate: ${selectedDate ? moment(selectedDate).format('MM/DD/YYYY') : 'No date selected'}`);
        setModalVisible(false);
    };

    const handleRemoveIntervention = () => {
        if (comment === '') {
            Alert.alert('Veuillez ajouter un commentaire');
            return;
        }
        console.log('Refuser Intervention ' + selectedIntervention.id, 'Comment: ' + comment);
        setComment('');
        setSelectedIntervention(null);
        setModalVisible2(false);
        setModalVisible(false);
    }

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
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.intervention}
                        onPress={() => DemandeClick(item)}
                    >
                        <Text style={styles.Project}>{item.projet}</Text>
                        <Text style={styles.client}>Objet : {item.object}</Text>
                        <Text style={styles.client}>Client : {item.client}</Text>
                        <Text style={styles.technicien}>Technicien: {item.technicien}</Text>

                        <View style={styles.dateView}>
                            <Text style={styles.dateText}>{item.date}</Text>
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
                            {clients.map((client, index) => (
                                <Picker.Item key={index} label={client} value={client} />
                            ))}
                        </Picker>

                        <Text style={styles.label}>Projet</Text>
                        <Picker
                            selectedValue={selectedProject}
                            onValueChange={(itemValue, itemIndex) => setSelectedProject(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Séléctionner Projet" value="" />
                            {projects.map((project, index) => (
                                <Picker.Item key={index} label={project} value={project} />
                            ))}
                        </Picker>

                        {/* <Text style={styles.label}>Objet</Text>
                        <Picker
                            selectedValue={selectedObject}
                            onValueChange={(itemValue, itemIndex) => setSelectedObject(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Séléctionner Objet" value="" />
                            {objects.map((object, index) => (
                                <Picker.Item key={index} label={object} value={object} />
                            ))}
                        </Picker> */}

                        <Text style={styles.label}>Technicien</Text>
                        <Picker
                            selectedValue={selectedTechnician}
                            onValueChange={(itemValue, itemIndex) => setSelectedTechnician(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Séléctionner Technicien" value="" />
                            {techniciens.map((technician, index) => (
                                <Picker.Item key={index} label={technician} value={technician} />
                            ))}
                        </Picker>

                        <Text style={styles.label}>Prestation</Text>
                        <Picker
                            selectedValue={selectedPrestation}
                            onValueChange={(itemValue, itemIndex) => setSelectedPrestation(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Séléctionner Prestation" value="" />
                            {prestations.map((prestation, index) => (
                                <Picker.Item key={index} label={prestation} value={prestation} />
                            ))}
                        </Picker>

                        <Text style={styles.label}>Lieu de prélévement</Text>
                        <TextInput
                            value={adresse}
                            onChangeText={setAdresse}
                            style={[styles.input]}
                        />

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
        marginTop: 5
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
