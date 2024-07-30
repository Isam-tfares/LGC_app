import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { Picker } from '@react-native-picker/picker';
import { FlatList } from 'react-native-gesture-handler';

export default function Conge({ navigation }) {

    // State variables for input values
    const [showenSection, setShowenSection] = useState(false);
    const [availableDays, setAvailableDays] = useState(0);
    const [years, setYears] = useState([2022, 2023, 2024]);
    const [year, setYear] = useState(2024);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateType, setDateType] = useState('');

    const conges = [
        { "id": 1, "start_date": "2024-01-01", "end_date": "2024-01-02", "nbr_jrs": 2 },
        { "id": 2, "start_date": "2024-04-03", "end_date": "2024-04-10", "nbr_jrs": 8 },
        { "id": 3, "start_date": "2024-07-01", "end_date": "2024-07-10", "nbr_jrs": 10 },
    ]

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
                                <Picker.Item key={index} label={year} value={year} />
                            ))}
                        </Picker>
                    </View>
                </View>
                <View style={styles.header}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.textInfo}>Congés restants</Text>
                    </View>
                    <View style={[styles.valueContainer, { height: 50 }]}>
                        <Text style={styles.year2}>{availableDays} jour</Text>
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
                        {showenSection == true ? <Entypo name="chevron-thin-up" size={20} color="black" /> : <Entypo name="chevron-thin-down" size={24} color="black" />}
                    </TouchableOpacity>
                </View>
                {showenSection == true ?
                    (<FlatList
                        data={conges}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.conge}>
                                <Text style={styles.year}>{item.start_date} -> {item.end_date}</Text>
                                <Text style={styles.days}>{item.nbr_jrs} J</Text>
                            </View>
                        )}
                    />) : (<></>)}
            </View>
            <Text style={styles.title}>Demande Congé</Text>
            <View style={styles.formContainer}>
                <TouchableOpacity onPress={() => showDatePicker('from')}>
                    <TextInput
                        style={styles.input}
                        placeholder="Date de début"
                        value={fromDate}
                        editable={false}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showDatePicker('to')}>
                    <TextInput
                        style={styles.input}
                        placeholder="Date de fin"
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
        // backgroundColor: "#4b6aff",
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
