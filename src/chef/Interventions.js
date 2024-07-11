import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import moment from 'moment';
import { TextInput } from 'react-native-gesture-handler';
import { EvilIcons } from '@expo/vector-icons';


const generateDays = () => {
    const daysArray = [];
    for (let i = 0; i < 7; i++) {
        daysArray.push(moment().add(i, 'days'));
    }
    return daysArray;
};

export default function Interventions({ navigation }) {
    const [search, setSearch] = useState("");
    const days = generateDays();
    const [currentDay, setCurrentDay] = useState(days[0]);
    const [clicked, setClicked] = useState(0);

    const navbar = ["Tous", "Faites", "Non Faites", "Annulées"];
    const interventions = [
        { id: 1, client: 'Client 1', projet: 'Projet 1', adresse: 'Adresse 1', technicien: "Techinicien 1", date: "7/11/2024", type: 'Type 1', status: "validée" },
        { id: 2, client: 'Client 2', projet: 'Projet 2', adresse: 'Adresse 2', technicien: "Techinicien 2", date: "7/11/2024", type: 'Type 2', status: "validée" },
        { id: 3, client: 'Client 3', projet: 'Projet 3', adresse: 'Adresse 3', technicien: "Techinicien 3", date: "7/11/2024", type: 'Type 3', status: "annulée" },
        { id: 4, client: 'Client 4', projet: 'Projet 4', adresse: 'Adresse 4', technicien: "Techinicien 4", date: "7/11/2024", type: 'Type 4', status: "validée" },
        { id: 5, client: 'Client 5', projet: 'Projet 5', adresse: 'Adresse 5', technicien: "Techinicien 5", date: "7/11/2024", type: 'Type 5', status: "En cours" },
        { id: 6, client: 'Client 6', projet: 'Projet 6', adresse: 'Adresse 6', technicien: "Techinicien 6", date: "7/11/2024", type: 'Type 6', status: "En cours" },
    ];

    const interventionClick = (intervention) => {
        navigation.navigate('Intervention', { intervention });
    };

    const changeDay = (day) => {
        setCurrentDay(day);
    };

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={styles.searchView}>
                <TextInput placeholder='rechercher' value={search} onChangeText={setSearch}
                    style={styles.searchInput}
                />
                <EvilIcons name="search" size={24} color="black"
                    style={styles.searchIcon}
                />
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
                data={interventions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.intervention}
                        onPress={() => interventionClick(item)}
                    >
                        <Text style={styles.Project}>{item.projet}</Text>
                        <Text style={styles.client}>client : {item.client}</Text>
                        <Text style={styles.technicien}>Technicien: {item.technicien}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                            <Text style={styles.status}>Etat : </Text>
                            <Text style={item.status == "validée" ? styles.valide : (item.status == "annulée" ? styles.annule : styles.enCours)}>{item.status}</Text>
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
    }
});
