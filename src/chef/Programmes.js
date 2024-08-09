import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { EvilIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';
import Intervention from './Intervention';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Fontisto from '@expo/vector-icons/Fontisto';
import moment from 'moment';

function Interventions({ navigation }) {
    const [search, setSearch] = useState("");
    const [clicked, setClicked] = useState(0);
    const navbar = ["Tous", "Faites", "En cours", "Annulées"];
    const [selectedTechnician, setSelectedTechnician] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [dateType, setDateType] = useState('');
    console.log(selectedTechnician)
    const techniciens = ["Technicien 1", "Technicien 2", "Technicien 3", "Technicien 4", "Technicien 5"];
    const interventions = [
        { id: 1, client: 'Client 1', projet: 'Projet 1', object: "Objet 1", adresse: 'Adresse 1', technicien: "Technicien 1", date: "07/08/2024", type: 'Type 1', status: "faite", reception: "faite" },
        { id: 2, client: 'Client 2', projet: 'Projet 2', object: "Objet 2", adresse: 'Adresse 2', technicien: "Technicien 2", date: "07/08/2024", type: 'Type 2', status: "faite", reception: "En cours" },
        { id: 3, client: 'Client 3', projet: 'Projet 3', object: "Objet 3", adresse: 'Adresse 3', technicien: "Technicien 3", date: "07/08/2024", type: 'Type 3', status: "annulée" },
        { id: 4, client: 'Client 4', projet: 'Projet 4', object: "Objet 4", adresse: 'Adresse 4', technicien: "Technicien 4", date: "08/08/2024", type: 'Type 4', status: "faite", reception: "faite" },
        { id: 5, client: 'Client 5', projet: 'Projet 5', object: "Objet 5", adresse: 'Adresse 5', technicien: "Technicien 5", date: "08/08/2024", type: 'Type 5', status: "En cours" },
        { id: 6, client: 'Client 6', projet: 'Projet 6', object: "Objet 6", adresse: 'Adresse 6', technicien: "Technicien 6", date: "08/08/2024", type: 'Type 6', status: "En cours" },
    ];

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

        if (selectedTechnician && selectedTechnician !== "0") {
            filteredInterventions = filteredInterventions.filter(intervention =>
                intervention.technicien.toLowerCase().includes(selectedTechnician.toLowerCase())
            );
        }

        // Filter by status
        switch (navbar[clicked]) {
            case "Faites":
                return filteredInterventions.filter(intervention => intervention.status === "faite");
            case "En cours":
                return filteredInterventions.filter(intervention => intervention.status === "En cours");
            case "Annulées":
                return filteredInterventions.filter(intervention => intervention.status === "annulée");
            case "Tous":
            default:
                return filteredInterventions;
        }
    };

    const interventionClick = (intervention) => {
        navigation.navigate('Détails Intervention', { intervention });
    };

    const showDatePicker = (type) => {
        setDateType(type);
        setDatePickerVisibility(true);
    };

    // Hide date picker
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    // validate difference between two dates
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
            <View style={{ justifyContent: "center", flexDirection: "row" }}>
                <View style={styles.picker}>
                    <Picker
                        selectedValue={selectedTechnician}
                        onValueChange={(itemValue, itemIndex) => setSelectedTechnician(itemValue)}
                    // style={styles.picker}
                    >
                        <Picker.Item label="Séléctionner Technicien" value="0" />
                        {techniciens.map((technician, index) => (
                            <Picker.Item key={index} label={technician} value={technician} />
                        ))}
                    </Picker>
                </View>
            </View>

            <View style={styles.navBar}>
                {navbar.map((value, index) => {
                    return (
                        <TouchableOpacity style={index == clicked ? styles.clicked : styles.link}
                            key={index}
                            onPress={() => { setClicked(index) }}>
                            <Text style={index == clicked ?
                                { color: "black", fontWeight: "bold" } :
                                { color: "#a1a1a1" }}>
                                {value}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <FlatList
                data={filterInterventions()}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.intervention}
                        onPress={() => interventionClick(item)}
                    >
                        <View style={styles.idView}><Text style={styles.id}>N° Intervention : {item.id}</Text></View>
                        <Text style={styles.Project}>{item.projet}</Text>
                        <Text style={styles.client}>Objet : {item.object}</Text>
                        <Text style={styles.client}>client : {item.client}</Text>
                        <Text style={styles.technicien}>Technicien: {item.technicien}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                            <Text style={styles.status}>Etat : </Text>
                            <Text style={item.status == "Faite" ? styles.valide : (item.status == "Annulée" ? styles.annule : styles.enCours)}>{item.status}</Text>
                        </View>
                        <View style={styles.dateView}>
                            <Text style={styles.dateText}>{item.date}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                contentContainerStyle={styles.pgm}
            />

        </View>
    );
}

const Stack = createStackNavigator();

export default function Programmes() {
    return (
        <Stack.Navigator initialRouteName="Listes Interventions">
            <Stack.Screen
                name="Listes Interventions"
                component={Interventions}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Détails Intervention"
                component={Intervention}
            />
        </Stack.Navigator>
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
    picker: {
        width: '94%',
        paddingHorizontal: 10,
        backgroundColor: "#f2f2f2",
        borderRadius: 25,
    },
    navBar: {
        backgroundColor: "#eee",
        marginBottom: 10,
        // margin: 10,
        borderRadius: 25,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    clicked: {
        padding: 10,
        backgroundColor: "white",
        borderRadius: 10,
        paddingHorizontal: 20,
        borderColor: "black",
        borderWidth: .5,
        elevation: 2,
    },
    link: {
        padding: 10,
        paddingHorizontal: 20,
    },
    titleView: {
        borderBottomColor: "#fff",
        borderBottomWidth: 2,
        width: "65%",
        paddingBottom: 5,
    },
    title: {
        color: "#fff",
        fontSize: 20,
    },
    idView: {
        position: "absolute",
        top: 10,
        right: 10
    },
    id: {
        fontSize: 16,
        fontWeight: "bold",

    },
    monthView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    month: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#fff",
    },
    daysList: {
        marginTop: 10,
    },
    dayContainer: {
        marginRight: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
        elevation: 2,
        alignItems: 'center',
    },
    currentDay: {
        marginRight: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#0ba650',
        borderRadius: 5,
        elevation: 2,
        alignItems: 'center',
    },
    day: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dayName: {
        fontSize: 14,
        color: '#666',
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
    more: {
        position: "absolute",
        top: 20,
        right: 20,
    },
    status: {
        color: "#555",
        fontSize: 17
    },
    valide: {
        color: "green",
        fontSize: 17,
    },
    annule: {
        color: "red",
        fontSize: 17,
    },
    enCours: {
        color: "#4bacc0",
        fontSize: 17,
    },
    dateView: {
        position: "absolute",
        bottom: 15,
        right: 15,
    },
    dateText: {
        color: "#777"
    },
    plus: {
        position: "absolute",
        bottom: 70,
        right: 25,
        zIndex: 20,
    },
    datePickerButton: {
        backgroundColor: "#f2f2f2",
        padding: 10,
        marginBottom: 10,
        margin: 10,
        borderRadius: 25,
        alignItems: "center",
    },
    datePickerButtonText: {
        fontSize: 16,
        color: "#333",
    },
});