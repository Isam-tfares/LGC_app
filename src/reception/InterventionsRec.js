import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import moment from 'moment';
import Fontisto from '@expo/vector-icons/Fontisto';
import { EvilIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import InterventionRec from './InterventionRec';

function InterventionsRec({ navigation }) {
    const [search, setSearch] = useState("");
    const [clicked, setClicked] = useState(0);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateType, setDateType] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const navbar = ["Tous", "Faites", "En cours", "Annulées"];
    const interventions = [
        { id: 1, client: 'Client 1', projet: 'Projet 1', object: "Objet 1", adresse: 'Adresse 1', technicien: "Techinicien 1", date: "08/08/2024", prestation: 'Prestation 1', status: "Faite", reception: "Faite" },
        { id: 2, client: 'Client 2', projet: 'Projet 2', object: "Objet 2", adresse: 'Adresse 2', technicien: "Techinicien 2", date: "08/08/2024", prestation: 'Prestation 2', status: "Faite", reception: "En cours" },
        { id: 3, client: 'Client 3', projet: 'Projet 3', object: "Objet 3", adresse: 'Adresse 3', technicien: "Techinicien 3", date: "08/08/2024", prestation: 'Prestation 3', status: "Annulée" },
        { id: 4, client: 'Client 4', projet: 'Projet 4', object: "Objet 4", adresse: 'Adresse 4', technicien: "Techinicien 4", date: "09/08/2024", prestation: 'Prestation 4', status: "Faite", reception: "Faite" },
        { id: 5, client: 'Client 5', projet: 'Projet 5', object: "Objet 5", adresse: 'Adresse 5', technicien: "Techinicien 5", date: "09/08/2024", prestation: 'Prestation 5', status: "En cours" },
        { id: 6, client: 'Client 6', projet: 'Projet 6', object: "Objet 6", adresse: 'Adresse 6', technicien: "Techinicien 6", date: "09/08/2024", prestation: 'Prestation 6', status: "En cours" },
    ];
    useEffect(() => {
        // Initialize dates
        // const today = moment().format("DD/MM/YYYY");
        const secondDate = moment().add(7, 'day').format("DD/MM/YYYY");
        const firstDate = moment().subtract(7, 'day').format("DD/MM/YYYY");

        setFromDate(firstDate);
        setToDate(secondDate);
    }, []);

    const showDatePicker = (type) => {
        setDateType(type);
        setDatePickerVisibility(true);
    };

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

        // Filter by status
        switch (navbar[clicked]) {
            case "Faites":
                return filteredInterventions.filter(intervention => intervention.status === "Faite");
            case "En cours":
                return filteredInterventions.filter(intervention => intervention.status === "En cours");
            case "Annulées":
                return filteredInterventions.filter(intervention => intervention.status === "Annulée");
            case "Tous":
            default:
                return filteredInterventions;
        }
    };

    const interventionClick = (intervention) => {
        navigation.navigate('Détails Intervention', { intervention });
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
                        <Text style={styles.client}>Client : {item.client}</Text>
                        <Text style={styles.technicien}>Technicien: {item.technicien}</Text>
                        <Text style={styles.client}>Etat Intervention : <Text style={item.status == "Faite" ? styles.valide : (item.status == "Annulée" ? styles.annule : styles.enCours)}>{item.status}</Text></Text>
                        {/* <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                            <Text style={styles.status}>Etat Intervention : </Text>
                            <Text style={item.status == "Faite" ? styles.valide : (item.status == "Annulée" ? styles.annule : styles.enCours)}>{item.status}</Text>
                        </View> */}
                        {item.status == "Faite" ? (
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                                <Text style={styles.status}>Etat Réception : </Text>
                                <Text style={item.reception == "Faite" ? styles.valide : styles.enCours}>{item.reception}</Text>
                            </View>) : (<></>)}
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

export default function InterventionsStackRec() {
    return (
        <Stack.Navigator initialRouteName="Listes Interventions">
            <Stack.Screen
                name="Listes Interventions"
                component={InterventionsRec}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Détails Intervention"
                component={InterventionRec}
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
    navBar: {
        backgroundColor: "#eee",
        marginBottom: 10,
        margin: 10,
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
        fontSize: 17,
        fontWeight: "bold"
    },
    valide: {
        color: "green",
        fontSize: 17,
        fontWeight: "bold"
    },
    annule: {
        color: "red",
        fontSize: 17,
        fontWeight: "bold"
    },
    enCours: {
        color: "#4bacc0",
        fontSize: 17,
        fontWeight: "bold"
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
        alignItems: 'center',
    },
    datePickerButtonText: {
        color: "#333",
        fontSize: 16,
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
});
