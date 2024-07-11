import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import moment from 'moment';
import { createStackNavigator } from '@react-navigation/stack';
import Intervention from "./Intervention"


const generateDays = () => {
    const daysArray = [];
    for (let i = 0; i < 7; i++) {
        daysArray.push(moment().add(i, 'days'));
    }
    return daysArray;
};

function Programme({ navigation }) {
    const days = generateDays();
    const [currentDay, setCurrentDay] = useState(days[0]);

    const interventions = [
        { id: 1, client: 'client1', projet: 'projet1', adresse: 'adresse1', type: 'type1' },
        { id: 2, client: 'client2', projet: 'projet2', adresse: 'adresse2', type: 'type2' },
        { id: 3, client: 'client3', projet: 'projet3', adresse: 'adresse3', type: 'type3' },
        { id: 4, client: 'client4', projet: 'projet4', adresse: 'adresse4', type: 'type4' },
        { id: 5, client: 'client5', projet: 'projet5', adresse: 'adresse5', type: 'type5' },
        { id: 6, client: 'client6', projet: 'projet6', adresse: 'adresse6', type: 'type6' },
    ];

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
                {/* <View style={styles.monthView}>
                    <Text style={styles.month}>{currentMonth.format('MMMM')}</Text>
                </View> */}

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

            </View>

            <FlatList
                data={interventions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.intervention}
                        onPress={() => interventionClick(item)}
                    >
                        <Text style={styles.interventionText}>Client: {item.client}</Text>
                        <Text style={styles.interventionText}>Projet: {item.projet}</Text>
                        <Text style={styles.interventionText}>Adresse: {item.adresse}</Text>
                        <Text style={styles.interventionText}>Type: {item.type}</Text>
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
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        elevation: 2,
        marginBottom: 10,
    },
    interventionText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    itemSeparator: {
        height: 10,
    },
});
