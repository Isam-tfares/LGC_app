import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';

export default function PV({ navigation }) {
    const [selectedIntervention, setSelectedIntervention] = useState('');
    const [image, setImage] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const interventions = ["Intervention A", "Intervention B", "Intervention C", "Intervention D", "Intervention E"];

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                quality: 1,
            });

            if (!result.cancelled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de sélectionner une image.');
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

    const handlePrepareData = () => {
        if (!selectedIntervention) {
            Alert.alert('Erreur', 'Veuillez sélectionner une intervention.');
            return;
        }

        console.log({
            selectedIntervention,
            image,
            selectedDate: moment(selectedDate).format('MM/DD/YYYY'),
        });

        setSelectedIntervention('');
        setImage(null);
        setSelectedDate(new Date());
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ajouter PV</Text>
            <View style={styles.card}>

                <Picker
                    selectedValue={selectedIntervention}
                    onValueChange={(itemValue, itemIndex) => setSelectedIntervention(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Sélectionner Intervention" value="" />
                    {interventions.map((intervention, index) => (
                        <Picker.Item key={index} label={intervention} value={intervention} />
                    ))}
                </Picker>

                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Text style={styles.buttonText}>Sélectionner Image</Text>
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={styles.image} />}

                <TouchableOpacity style={styles.button} onPress={showDatePicker}>
                    <Text style={styles.buttonText}>
                        {moment(selectedDate).format('MM/DD/YYYY')}
                    </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />

                <TouchableOpacity style={styles.button} onPress={handlePrepareData}>
                    <Text style={styles.buttonText}>Ajouter</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
        width: '100%',
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        fontWeight: 'bold',
        marginBottom: 10,
    },
    picker: {
        width: '100%',
        height: 50,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#4bacc0',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 20,
        marginBottom: 20,
    },
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
        backgroundColor: '#4bacc0',
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
});
