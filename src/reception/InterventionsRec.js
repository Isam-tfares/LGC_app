import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import moment from 'moment';
import { EvilIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import InterventionRec from './InterventionRec';

function InterventionsRec({ navigation }) {
    const [search, setSearch] = useState("");
    const [clicked, setClicked] = useState(0);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const navbar = ["Tous", "Faites", "Non Faites", "Annulées"];
    const interventions = [
        { id: 1, client: 'Client 1', projet: 'Projet 1', object: "Objet 1", adresse: 'Adresse 1', technicien: "Techinicien 1", date: "23/7/2024", type: 'Type 1', status: "faite", reception: "faite" },
        { id: 2, client: 'Client 2', projet: 'Projet 2', object: "Objet 2", adresse: 'Adresse 2', technicien: "Techinicien 2", date: "23/7/2024", type: 'Type 2', status: "faite", reception: "Non faite" },
        { id: 3, client: 'Client 3', projet: 'Projet 3', object: "Objet 3", adresse: 'Adresse 3', technicien: "Techinicien 3", date: "23/7/2024", type: 'Type 3', status: "annulée" },
        { id: 4, client: 'Client 4', projet: 'Projet 4', object: "Objet 4", adresse: 'Adresse 4', technicien: "Techinicien 4", date: "24/7/2024", type: 'Type 4', status: "faite", reception: "faite" },
        { id: 5, client: 'Client 5', projet: 'Projet 5', object: "Objet 5", adresse: 'Adresse 5', technicien: "Techinicien 5", date: "24/7/2024", type: 'Type 5', status: "Non faite" },
        { id: 6, client: 'Client 6', projet: 'Projet 6', object: "Objet 6", adresse: 'Adresse 6', technicien: "Techinicien 6", date: "24/7/2024", type: 'Type 6', status: "Non faite" },
    ];

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

    const filterInterventions = () => {
        let filteredInterventions = interventions;

        if (search) {
            filteredInterventions = filteredInterventions.filter(intervention =>
                intervention.projet.toLowerCase().includes(search.toLowerCase()) ||
                intervention.client.toLowerCase().includes(search.toLowerCase()) ||
                intervention.technicien.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (selectedDate) {
            const formattedDate = moment(selectedDate).format('D/M/YYYY');
            filteredInterventions = filteredInterventions.filter(intervention =>
                intervention.date === formattedDate
            );
        }

        switch (navbar[clicked]) {
            case "Faites":
                return filteredInterventions.filter(intervention => intervention.status === "faite");
            case "Non Faites":
                return filteredInterventions.filter(intervention => intervention.status === "Non faite");
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

            <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
                <Text style={styles.datePickerButtonText}>
                    {selectedDate ? moment(selectedDate).format('DD/MM/YYYY') : 'Sélectionner Date'}
                </Text>
            </TouchableOpacity>

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
                        <Text style={styles.Project}>{item.projet}</Text>
                        <Text style={styles.client}>Objet : {item.object}</Text>
                        <Text style={styles.client}>Client : {item.client}</Text>
                        <Text style={styles.technicien}>Technicien: {item.technicien}</Text>
                        <Text style={styles.client}>Etat Intervention : <Text style={item.status == "faite" ? styles.valide : (item.status == "annulée" ? styles.annule : styles.enCours)}>{item.status}</Text></Text>
                        {/* <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                            <Text style={styles.status}>Etat Intervention : </Text>
                            <Text style={item.status == "faite" ? styles.valide : (item.status == "annulée" ? styles.annule : styles.enCours)}>{item.status}</Text>
                        </View> */}
                        {item.status == "faite" ? (
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                                <Text style={styles.status}>Etat Réception : </Text>
                                <Text style={item.reception == "faite" ? styles.valide : styles.enCours}>{item.reception}</Text>
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
});
