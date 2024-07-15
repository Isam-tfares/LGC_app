import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { EvilIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';
import Intervention from './Intervention';

function Interventions({ navigation }) {
    const [search, setSearch] = useState("");
    const [clicked, setClicked] = useState(0);
    const navbar = ["Tous", "Faites", "Non Faites", "Annulées"];
    const [selectedTechnician, setSelectedTechnician] = useState('');

    const techniciens = ["Technicien 1", "Technicien 2", "Technicien 3", "Technicien 4", "Technicien 5"];
    const interventions = [
        { id: 1, client: 'Client 1', projet: 'Projet 1', object: "Objet 1", adresse: 'Adresse 1', technicien: "Technicien 1", date: "7/11/2024", type: 'Type 1', status: "faite" },
        { id: 2, client: 'Client 2', projet: 'Projet 2', object: "Objet 2", adresse: 'Adresse 2', technicien: "Technicien 2", date: "7/11/2024", type: 'Type 2', status: "faite" },
        { id: 3, client: 'Client 3', projet: 'Projet 3', object: "Objet 3", adresse: 'Adresse 3', technicien: "Technicien 3", date: "7/11/2024", type: 'Type 3', status: "annulée" },
        { id: 4, client: 'Client 4', projet: 'Projet 4', object: "Objet 4", adresse: 'Adresse 4', technicien: "Technicien 4", date: "7/11/2024", type: 'Type 4', status: "faite" },
        { id: 5, client: 'Client 5', projet: 'Projet 5', object: "Objet 5", adresse: 'Adresse 5', technicien: "Technicien 5", date: "7/11/2024", type: 'Type 5', status: "Non faite" },
        { id: 6, client: 'Client 6', projet: 'Projet 6', object: "Objet 6", adresse: 'Adresse 6', technicien: "Technicien 3", date: "7/11/2024", type: 'Type 6', status: "Non faite" },
    ];

    const filterInterventions = () => {
        let filteredInterventions = interventions;

        if (search) {
            filteredInterventions = filteredInterventions.filter(intervention =>
                intervention.projet.toLowerCase().includes(search.toLowerCase()) ||
                intervention.client.toLowerCase().includes(search.toLowerCase()) ||
                intervention.technicien.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (selectedTechnician) {
            filteredInterventions = filteredInterventions.filter(intervention =>
                intervention.technicien.toLowerCase().includes(selectedTechnician.toLowerCase())
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
            <View>
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
                        <Text style={styles.Project}>{item.projet}</Text>
                        <Text style={styles.client}>Objet : {item.object}</Text>
                        <Text style={styles.client}>client : {item.client}</Text>
                        <Text style={styles.technicien}>Technicien: {item.technicien}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                            <Text style={styles.status}>Etat : </Text>
                            <Text style={item.status == "faite" ? styles.valide : (item.status == "annulée" ? styles.annule : styles.enCours)}>{item.status}</Text>
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
        // borderRadius: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        // elevation: 2,
        // marginBottom: 10,
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
    }
});
