import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import moment from 'moment';
import { createStackNavigator } from '@react-navigation/stack';
import Intervention from './Intervention';

const generateDays = () => {
    const daysArray = [];
    for (let i = -3; i < 4; i++) {
        daysArray.push(moment().add(i, 'days'));
    }
    return daysArray;
};

function Programme({ navigation }) {
    const days = generateDays();
    const [currentDay, setCurrentDay] = useState(days[3]);

    const interventions = [
        { id: 1, client: 'Client 1', projet: 'Projet 1', object: "Objet 1", adresse: 'Adresse 1', technicien: "Techinicien 1", date: "8/04/2024", prestation: 'Prestation 1', status: "faite", reception: "faite" },
        { id: 2, client: 'Client 2', projet: 'Projet 2', object: "Objet 2", adresse: 'Adresse 2', technicien: "Techinicien 2", date: "8/04/2024", prestation: 'Prestation 2', status: "faite", reception: "Non faite" },
        { id: 3, client: 'Client 3', projet: 'Projet 3', object: "Objet 3", adresse: 'Adresse 3', technicien: "Techinicien 3", date: "8/04/2024", prestation: 'Prestation 3', status: "annulée", obs: "commentaire sur annulation d\'intervention" },
        { id: 4, client: 'Client 4', projet: 'Projet 4', object: "Objet 4", adresse: 'Adresse 4', technicien: "Techinicien 4", date: "8/05/2024", prestation: 'Prestation 4', status: "faite", reception: "faite" },
        { id: 5, client: 'Client 5', projet: 'Projet 5', object: "Objet 5", adresse: 'Adresse 5', technicien: "Techinicien 5", date: "8/05/2024", prestation: 'Prestation 5', status: "Non faite" },
        { id: 6, client: 'Client 6', projet: 'Projet 6', object: "Objet 6", adresse: 'Adresse 6', technicien: "Techinicien 6", date: "8/05/2024", prestation: 'Prestation 6', status: "Non faite" },
    ];

    const filterInterventionsbyDay = () => {
        const filteredInterventions = interventions.filter(item => {
            return moment(item.date, 'M/D/YYYY').isSame(currentDay, 'day');
        });
        return filteredInterventions;
    };

    const interventionClick = (intervention) => {
        navigation.navigate('Intervention', { intervention });
    };

    const changeDay = (day) => {
        setCurrentDay(day);
    };

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={styles.header}>
                <FlatList
                    horizontal
                    data={days}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.daysList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={item.isSame(currentDay, 'day') ? styles.currentDay : styles.dayContainer}
                            onPress={() => changeDay(item)}
                        >
                            <Text style={item.isSame(currentDay, 'day') ? styles.day2 : styles.day}>{item.format('D')}</Text>
                            <Text style={item.isSame(currentDay, 'day') ? styles.dayName2 : styles.dayName}>{item.format('dd')}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <View style={styles.main}>
                <FlatList
                    data={filterInterventionsbyDay()}
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
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                                <Text style={styles.status}>État : </Text>
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
        </View>
    );
}

const Stack = createStackNavigator();

export default function ProgrammeStack() {
    return (
        <Stack.Navigator initialRouteName="ProgrammeScreen">
            <Stack.Screen
                name="ProgrammeScreen"
                component={Programme}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Intervention"
                component={Intervention}
            />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 10,
        marginBottom: 10,
        alignItems: "center"
    },
    daysList: {
        marginTop: 10,
    },
    dayContainer: {
        marginRight: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#ebebeb',
        borderRadius: 5,
        elevation: 2,
        alignItems: 'center',
    },
    currentDay: {
        marginRight: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#0853a1',
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
    day2: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "white"
    },
    dayName2: {
        fontSize: 14,
        color: '#fff',
    },
    main: { backgroundColor: "#ebebeb", flex: 1, paddingVertical: 10 },
    pgm: {
        flexGrow: 1,
        padding: 10,
        paddingTop: 0,
    },
    intervention: {
        backgroundColor: 'white',
        padding: 15,
        marginRight: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderRadius: 10,
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
    itemSeparator: {
        height: 10,
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

    }
});
