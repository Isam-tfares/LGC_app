import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Fontisto from '@expo/vector-icons/Fontisto';
import { EvilIcons } from '@expo/vector-icons';
import moment from 'moment';
import ReceptionDetails from './ReceptionDetails';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function Receptions({ route, navigation }) {
    const [search, setSearch] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateType, setDateType] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [receptions, setReceptions] = useState([
        {
            n_reception: '4848',
            n_intervention: 1,
            id: '1',
            project: 'Project A',
            client: 'Client X',
            technicien: 'Technician 1',
            prestation: 'Prestation 1',
            materiaux: 'Material 1',
            date_reception: '09-08-2024',
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
            date_reception: '08-08-2024',
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
            date_reception: '09-08-2024',
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
            date_reception: '08-08-2024',
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
            date_reception: '08-08-2024',
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
    ]);
    useEffect(() => {
        // Initialize dates
        const secondDate = moment().add(7, 'day').format("DD/MM/YYYY");
        const firstDate = moment().subtract(7, 'day').format("DD/MM/YYYY");

        setFromDate(firstDate);
        setToDate(secondDate);
    }, []);

    const handleReceptionPress = (reception) => {
        navigation.navigate('Détails Réception', { reception });
    };

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
        const formattedDate = moment(date).format("DD-MM-YYYY");
        if (dateType === 'from') {
            setFromDate(formattedDate);
        } else {
            if (!validateDateRange(formattedDate)) {
                Alert.alert("Plage de dates non valide", "La date De doit être antérieure ou égale à la date À.");
            } else {
                setToDate(formattedDate);
            }
        }
        hideDatePicker();
    };


    const filterReceptions = () => {
        let filteredReceptions = receptions;

        // if (search) {
        //     filteredReceptions = filteredReceptions.filter(reception =>
        //         reception.client.toLowerCase().includes(search.toLowerCase()) ||
        //         reception.project.toLowerCase().includes(search.toLowerCase()) ||
        //         reception.technicien.toLowerCase().includes(search.toLowerCase()) ||
        //         reception.prestation.toLowerCase().includes(search.toLowerCase()) ||
        //         reception.materiaux.toLowerCase().includes(search.toLowerCase()) ||
        //         reception.n_reception.toLowerCase().includes(search.toLowerCase())
        //     );
        // }

        // Convert fromDate and toDate to Date objects
        const fromDateObj = fromDate ? moment(fromDate, "DD-MM-YYYY").toDate() : null;
        const toDateObj = toDate ? moment(toDate, "DD-MM-YYYY").toDate() : null;

        // Convert intervention dates to Date objects
        filteredReceptions = filteredReceptions.filter(reception => {
            const receptionDate = moment(reception.date_reception, "DD-MM-YYYY").toDate();

            // Filter by search query
            const searchMatch = search === "" ||
                reception.client.toLowerCase().includes(search.toLowerCase()) ||
                reception.project.toLowerCase().includes(search.toLowerCase()) ||
                reception.technicien.toLowerCase().includes(search.toLowerCase()) ||
                reception.prestation.toLowerCase().includes(search.toLowerCase()) ||
                reception.materiaux.toLowerCase().includes(search.toLowerCase()) ||
                reception.n_reception.toLowerCase().includes(search.toLowerCase());

            // Filter by date range
            const dateMatch = (!fromDateObj || receptionDate >= fromDateObj) &&
                (!toDateObj || receptionDate <= toDateObj);

            return searchMatch && dateMatch;
        });

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

            <FlatList
                data={filterReceptions()}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.receptionItem} onPress={() => handleReceptionPress(item)}>
                        <View style={styles.itemHeader}>
                            <Text style={styles.itemTitle}>Project: {item.project}</Text>
                            <Text style={styles.itemDate}>{moment(item.date_reception, "DD-MM-YYYY").format('DD/MM/YYYY')}</Text>
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
export default function ReceptionsStack({ route, navigation }) {
    console.log("route params ", route.params);
    let { id: intervention_id } = route.params || {}; // Destructure and set default empty object
    console.log("intervention_id ", intervention_id);
    useEffect(() => {
        if (intervention_id) {
            let tmp = intervention_id;
            intervention_id = {};
            navigation.navigate('Détails Réception', { id: tmp });
        }
    }, [intervention_id]);

    return (
        <Stack.Navigator initialRouteName="Listes Receptions">
            <Stack.Screen
                name="Listes Receptions"
                component={Receptions}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Détails Réception"
                component={ReceptionDetails}
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