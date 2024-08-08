import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { EvilIcons } from '@expo/vector-icons';
import moment from 'moment';
import PreReceptionDetails from './PreReceptionDetails';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function PreReceptions({ route, navigation }) {
    const [search, setSearch] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const receptions = [
        {
            n_reception: '4848',
            n_intervention: 1,
            id: '1',
            project: 'Project A',
            client: 'Client X',
            technicien: 'Technician 1',
            prestation: 'Prestation 1',
            materiaux: 'Material 1',
            date_reception: '2024-07-25',
            nbr_echantillon: '10',
            etat_recuperation: 'Récupérée',
            preleve: 'LGC',
            essaie: 'interne',
            beton: 'Béton 1',
            slump: '10 cm',
            central: 'Plant A',
            BL: '12345',
            nbr_jrs: '7,28',
        },
        {
            n_reception: '4849',
            n_intervention: 2,
            id: '2',
            project: 'Project B',
            client: 'Client Y',
            technicien: 'Technician 2',
            prestation: 'Prestation 2',
            materiaux: 'Material 2',
            date_reception: '2024-07-24',
            nbr_echantillon: '15',
            etat_recuperation: 'non récupérée',
            preleve: 'LGC',
            essaie: 'externe',
            beton: 'Concrete B',
            slump: '12 cm',
            central: 'Plant B',
            BL: '67890',
            nbr_jrs: '7,14,28',
        },
        {
            n_reception: '4850',
            n_intervention: 3,
            id: '3',
            project: 'Project A',
            client: 'Client X',
            technicien: 'Technician 1',
            prestation: 'Prestation 1',
            materiaux: 'Material 1',
            date_reception: '2024-07-25',
            nbr_echantillon: '10',
            etat_recuperation: 'Récupérée',
            preleve: 'LGC',
            essaie: 'interne',
            beton: 'Béton 1',
            slump: '10 cm',
            central: 'Plant A',
            BL: '12345',
            nbr_jrs: '7,28',
        },
        {
            n_reception: '4851',
            n_intervention: 4,
            id: '4',
            project: 'Project B',
            client: 'Client Y',
            technicien: 'Technician 2',
            prestation: 'Prestation 2',
            materiaux: 'Material 2',
            date_reception: '2024-07-24',
            nbr_echantillon: '15',
            etat_recuperation: 'non récupérée',
            preleve: 'LGC',
            essaie: 'externe',
            beton: 'Concrete B',
            slump: '12 cm',
            central: 'Plant B',
            BL: '67890',
            nbr_jrs: '7,14,28',
        },
        {
            n_reception: '4852',
            n_intervention: 5,
            id: '5',
            project: 'Project D',
            client: 'Client Y',
            technicien: 'Technician 2',
            prestation: 'Prestation 2',
            materiaux: 'Material 2',
            date_reception: '2024-07-24',
            nbr_echantillon: '15',
            etat_recuperation: 'non récupérée',
            preleve: 'LGC',
            essaie: 'externe',
            beton: 'Concrete B',
            slump: '12 cm',
            central: 'Plant B',
            BL: '67890',
            nbr_jrs: '7,14,28',
        },
    ];

    const handleReceptionPress = (reception) => {
        navigation.navigate('Détails PreRéception', { reception });
    };

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

    const filterReceptions = () => {
        let filteredReceptions = receptions;

        if (search) {
            filteredReceptions = filteredReceptions.filter(reception =>
                reception.client.toLowerCase().includes(search.toLowerCase()) ||
                reception.project.toLowerCase().includes(search.toLowerCase()) ||
                reception.technicien.toLowerCase().includes(search.toLowerCase()) ||
                reception.prestation.toLowerCase().includes(search.toLowerCase()) ||
                reception.materiaux.toLowerCase().includes(search.toLowerCase()) ||
                reception.n_reception.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (selectedDate) {
            const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
            filteredReceptions = filteredReceptions.filter(reception =>
                reception.date_reception === formattedDate
            );
        }

        return filteredReceptions;
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchView}>
                <TextInput
                    placeholder='Rechercher'
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                />
                <EvilIcons name="search" size={24} color="black" style={styles.searchIcon} />
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

            <FlatList
                data={filterReceptions()}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.receptionItem} onPress={() => handleReceptionPress(item)}>
                        <View style={styles.itemHeader}>
                            <Text style={styles.itemTitle}>Project: {item.project}</Text>
                            <Text style={styles.itemDate}>{moment(item.date_reception).format('DD/MM/YYYY')}</Text>
                        </View>
                        <View style={styles.itemBody}>
                            <Text style={[styles.itemText, { fontWeight: "bold" }]}>N° réception: {item.n_reception}</Text>
                            <Text style={styles.itemText}>Client: {item.client}</Text>
                            <Text style={styles.itemText}>Technician: {item.technicien}</Text>
                            <Text style={styles.itemText}>Prestation: {item.prestation}</Text>
                            <Text style={styles.itemText}>Material: {item.materiaux}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

export default function PreReceptionsStack({ route, navigation }) {
    const { id: intervention_id } = route.params || {}; // Destructure and set default empty object

    useEffect(() => {
        if (intervention_id) {
            navigation.navigate('Détails PreRéception', { id: intervention_id });
        }
        else {
            console.log("No intervention_id");
        }
    }, [intervention_id, navigation]);

    return (
        <Stack.Navigator initialRouteName="Listes PreReceptions">
            <Stack.Screen
                name="Listes PreReceptions"
                component={PreReceptions}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Détails PreRéception"
                component={PreReceptionDetails}
            />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    searchView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        padding: 10,
    },
    searchIcon: {
        padding: 10,
    },
    datePickerButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 20,
    },
    datePickerButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    receptionItem: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemDate: {
        fontSize: 14,
        color: '#888',
    },
    itemBody: {
        marginTop: 10,
    },
    itemText: {
        fontSize: 16,
        color: '#555',
    },
});