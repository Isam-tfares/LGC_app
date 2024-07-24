import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import moment from 'moment';
import { createStackNavigator } from '@react-navigation/stack';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Intervention from "./Intervention"

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
    // const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    // const [selectedDate, setSelectedDate] = useState(null);

    const interventions = [
        { id: 1, client: 'Client 1', projet: 'Projet 1', object: "Objet 1", adresse: 'Adresse 1', technicien: "Techinicien 1", date: "7/24/2024", type: 'Type 1', status: "faite" },
        { id: 2, client: 'Client 2', projet: 'Projet 2', object: "Objet 2", adresse: 'Adresse 2', technicien: "Techinicien 2", date: "7/24/2024", type: 'Type 2', status: "faite" },
        { id: 3, client: 'Client 3', projet: 'Projet 3', object: "Objet 3", adresse: 'Adresse 3', technicien: "Techinicien 3", date: "7/24/2024", type: 'Type 3', status: "annulée", obs: "observation about annulation" },
        { id: 4, client: 'Client 4', projet: 'Projet 4', object: "Objet 4", adresse: 'Adresse 4', technicien: "Techinicien 4", date: "7/25/2024", type: 'Type 4', status: "faite" },
        { id: 5, client: 'Client 5', projet: 'Projet 5', object: "Objet 5", adresse: 'Adresse 5', technicien: "Techinicien 5", date: "7/25/2024", type: 'Type 5', status: "Non faite" },
        { id: 6, client: 'Client 6', projet: 'Projet 6', object: "Objet 6", adresse: 'Adresse 6', technicien: "Techinicien 6", date: "7/25/2024", type: 'Type 6', status: "Non faite" },
    ];

    // const showDatePicker = () => {
    //     setDatePickerVisibility(true);
    // };

    // const hideDatePicker = () => {
    //     setDatePickerVisibility(false);
    // };

    // const handleConfirm = (date) => {
    //     setSelectedDate(date);
    //     setCurrentDay(moment(date));
    //     hideDatePicker();
    // };

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
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <View style={styles.titleView}>
                    <Text style={styles.title}>PROGRAMME DU JOUR</Text>
                </View>
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
                            <Text style={styles.day}>{item.format('D')}</Text>
                            <Text style={styles.dayName}>{item.format('dd')}</Text>
                        </TouchableOpacity>
                    )}
                />
                {/* <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
                    <Text style={styles.datePickerButtonText}>Select Date</Text>
                </TouchableOpacity> */}
                {/*<DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />*/}
            </View>
            <FlatList
                data={filterInterventionsbyDay()}
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
        backgroundColor: "#0853a1",
        padding: 10,
        marginBottom: 10,
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
});
