import React, { useState } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

export default function AddIntervention({ modalVisible, setModalVisible }) {
    const clients = ["client 1", "client 2", "client 3", "client 4", "client 5"];
    const projects = ["project 10", "project 11", "project 12", "project 13", "project 14", "project 15"];
    // const objects = ["object 1", "object 2", "object 3", "object 4", "object 5", "object 6", "object 7", "object 8", "object 9", "object 10"];
    const prestations = ["prestation 1", "prestation 2", "prestation 3", "prestation 4", "prestation 5", "prestation 6", "prestation 7", "prestation 8", "prestation 9", "prestation 10"];
    const techniciens = ["technicien 1", "technicien 2", "technicien 3", "technicien 4", "technicien 5"];

    const [selectedClient, setSelectedClient] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    // const [selectedObject, setSelectedObject] = useState('');
    const [selectedTechnician, setSelectedTechnician] = useState('');
    const [selectedPrestation, setSelectedPrestation] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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
        Alert.alert('Intervention ajoutée',
            `Client: ${selectedClient}\nProject: ${selectedProject}\nTechnician: ${selectedTechnician}\nPrestation: ${selectedPrestation}\nDate: ${selectedDate ? moment(selectedDate).format('MM/DD/YYYY') : 'No date selected'}`);
        setModalVisible(false);
    };

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
                        onPress={() => setModalVisible(false)}
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
