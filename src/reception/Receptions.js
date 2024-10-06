import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Fontisto from '@expo/vector-icons/Fontisto';
import { EvilIcons } from '@expo/vector-icons';
import moment from 'moment';
import ReceptionDetails from './ReceptionDetails';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';


const Stack = createStackNavigator();

function Receptions({ route, navigation }) {
    const TOKEN = useSelector(state => state.user.token);
    const BASE_URL = useSelector(state => state.baseURL.baseURL); // Move this line inside the component

    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateType, setDateType] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [toDateAPI, setToDateAPI] = useState(null);
    const [fromDateAPI, setFromDateAPI] = useState(null);
    const [receptions, setReceptions] = useState([]);

    const onRefresh = useCallback(() => {
        const API_URL = `${BASE_URL}/?page=Receptions`;
        fetchData(API_URL, TOKEN);
    }, [fromDateAPI, toDateAPI]);
    useEffect(() => {
        // Initialize dates
        const secondDate = moment().format("DD/MM/YYYY");
        const firstDate = moment().subtract(15, 'day').format("DD/MM/YYYY");

        setFromDateAPI(parseInt(moment(firstDate, "DD/MM/YYYY").format("YYYYMMDD")));
        setToDateAPI(parseInt(moment(secondDate, "DD/MM/YYYY").format("YYYYMMDD")));
        setFromDate(firstDate);
        setToDate(secondDate);
    }, []);
    useEffect(() => {
        const API_URL = `${BASE_URL}/?page=Receptions`;

        fetchData(API_URL, TOKEN);
    }, [fromDateAPI, toDateAPI]);

    const fetchData = async (url, token) => {
        if (fromDateAPI === null || toDateAPI === null) return;
        setRefreshing(true);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "fromDate": fromDateAPI, "toDate": toDateAPI }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status : ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                try {
                    if (text[0] == "[" || text[0] == "{") {
                        data = JSON.parse(text);
                    }
                    else {
                        data = [];
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    // Handle non-JSON data if necessary
                    return;
                }
            }
            if (data.error && data.error == "Expired token") {
                navigation.navigate("Déconnexion");
                console.log("Log Out");
                return;
            }
            // check if data is Object
            if (typeof data === 'object' && data !== null) {
                setReceptions(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setRefreshing(false);
        }
    };

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
        const formattedDate = moment(date).format("DD/MM/YYYY");

        if (dateType === 'from') {
            setFromDate(formattedDate);
            const fromDateObj = moment(formattedDate, "DD/MM/YYYY");
            const fromDateAPIFormat = fromDateObj.format("YYYYMMDD");
            // Update API date states
            setFromDateAPI(parseInt(fromDateAPIFormat, 10));

        } else {
            if (!validateDateRange(formattedDate)) {
                Alert.alert("Plage de dates non valide", "La date  De  doit être antérieure ou égale à la date  À .");
            } else {
                setToDate(formattedDate);
                const toDateObj = moment(formattedDate, "DD/MM/YYYY");
                const toDateAPIFormat = toDateObj.format("YYYYMMDD");
                setToDateAPI(parseInt(toDateAPIFormat, 10));
            }
        }
        hideDatePicker();
    };

    const filterReceptions = () => {
        let filteredReceptions = receptions;

        if (search) {
            filteredReceptions = filteredReceptions.filter(reception =>
                reception.abr_client.toLowerCase().includes(search.toLowerCase()) ||
                reception.abr_project.toLowerCase().includes(search.toLowerCase()) ||
                reception.PersonnelNom.toLowerCase().includes(search.toLowerCase()) ||
                reception.PhaseLibelle.toLowerCase().includes(search.toLowerCase()) ||
                // reception.materiaux.toLowerCase().includes(search.toLowerCase()) ||
                reception.IDPhase_projet.toLowerCase().includes(search.toLowerCase())
            );
        }

        return filteredReceptions;
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.receptionItem} onPress={() => handleReceptionPress(item)}>
            <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>Project: {item.abr_project}</Text>
                <Text style={styles.itemDate}>
                    {moment(item.saisiele, "YYYYMMDD").format("DD/MM/YYYY") || 'N/A'}
                </Text>
            </View>
            <View style={styles.itemBody}>
                <Text style={[styles.itemText, { fontWeight: "bold" }]}>N° réception: {item.Numero}</Text>
                <Text style={[styles.itemText, { fontWeight: "bold" }]}>Code Bar: {item.Observation}</Text>
                <Text style={styles.itemText}>Client: {item.abr_client}</Text>
                <Text style={styles.itemText}>Technician: {item.PersonnelNom}</Text>
                <Text style={styles.itemText}>Prestation: {item.PhaseLibelle}</Text>
                <Text style={styles.itemText}>Material: {item.MateriauxLibelle}</Text>
            </View>
        </TouchableOpacity>
    );

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
                keyExtractor={(item) => item.IDPhase_projet.toString()}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}
            />
        </View>
    );
}
export default function ReceptionsStack({ route, navigation }) {
    let { id: intervention_id } = route.params || {};
    useEffect(() => {
        if (intervention_id) {
            let tmp = intervention_id;
            intervention_id = {};
            navigation.navigate('Détails Réception', { id: tmp });
        }
    }, [route.params]);

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
    loading: {
        position: "absolute",
        top: "50%",
        left: "50%",
        zIndex: 111
    },
});