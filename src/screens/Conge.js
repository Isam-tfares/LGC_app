import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function Conge({ navigation }) {
    // Dummy data for available and taken days (replace with actual data)
    const availableDays = 20;
    const takenDays = 5;

    // State variables for input values
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateType, setDateType] = useState('');

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
        // Handle submit logic here, e.g., validate input, submit API request, etc.
        console.log('From Date:', fromDate);
        console.log('To Date:', toDate);
    };

    return (
        <View style={styles.container}>
            <View style={styles.daysContainer}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.labelText}>Jours restants </Text>
                        <Text style={styles.daysText}>{availableDays}</Text>
                    </View>
                    <View>
                        <Text style={styles.labelText}>Jours pris</Text>
                        <Text style={styles.daysText}>{takenDays}</Text>
                    </View>
                </View>
            </View>
            <Text style={styles.title}>Demander Congé</Text>
            <View style={styles.formContainer}>
                <TouchableOpacity onPress={() => showDatePicker('from')}>
                    <TextInput
                        style={styles.input}
                        placeholder="From date (DD/MM/YYYY)"
                        value={fromDate}
                        editable={false}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showDatePicker('to')}>
                    <TextInput
                        style={styles.input}
                        placeholder="To date (DD/MM/YYYY)"
                        value={toDate}
                        editable={false}
                    />
                </TouchableOpacity>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        // alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    daysContainer: {
        marginBottom: 20,
        backgroundColor: "#4b6aff",
        paddingLeft: 20,
        paddingTop: 20,
        borderRadius: 20,
    },
    daysText: {
        fontSize: 25,
        marginBottom: 10,
        fontWeight: "bold",
        color: "#fff",
    },
    labelText: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: "bold",
        color: "#d7dff9",
    },
    formContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 10,
        backgroundColor: '#f2f2f2', // make the input field look non-editable
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
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 25,
        paddingBottom: 10
    }
});
