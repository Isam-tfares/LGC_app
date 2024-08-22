import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, RefreshControl } from 'react-native';
import moment from 'moment';
import Fontisto from '@expo/vector-icons/Fontisto';
import { EvilIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import InterventionRec from './InterventionRec';
import { useSelector } from 'react-redux';

function InterventionsRec({ navigation }) {
    const TOKEN = useSelector(state => state.user.token); // Move this line inside the component

    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [clicked, setClicked] = useState(0);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateType, setDateType] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [fromDateAPI, setFromDateAPI] = useState(null);
    const [toDateAPI, setToDateAPI] = useState(null);
    const [interventions, setInterventions] = useState([]);
    const navbar = ["Tous", "Faites", "En cours", "Annulées"];

    useEffect(() => {
        // Initialize dates
        const secondDate = moment().add(7, 'day').format("DD/MM/YYYY");
        const firstDate = moment().subtract(7, 'day').format("DD/MM/YYYY");

        setFromDateAPI(parseInt(moment(firstDate, "DD/MM/YYYY").format("YYYYMMDD")));
        setToDateAPI(parseInt(moment(secondDate, "DD/MM/YYYY").format("YYYYMMDD")));
        setFromDate(firstDate);
        setToDate(secondDate);
    }, []);
    useEffect(() => {
        const API_URL = 'http://10.0.2.2/LGC_backend/?page=interventionsRec';

        fetchData(API_URL, TOKEN);
    }, [fromDateAPI, toDateAPI]);
    const onRefresh = useCallback(() => {
        const API_URL = 'http://10.0.2.2/LGC_backend/?page=interventionsRec';
        fetchData(API_URL, TOKEN);
    }, [fromDateAPI, toDateAPI]);

    const fetchData = async (url, token) => {
        if (fromDateAPI === null || toDateAPI === null) {
            return;
        }
        try {
            setRefreshing(true);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "fromDate": fromDateAPI, "toDate": toDateAPI }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
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
                    } else {
                        data = [];
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    // Handle non-JSON data if necessary
                    return;
                }
            }

            // check if data is Object
            if (typeof data === 'object' && data !== null) {
                setInterventions(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setRefreshing(false);
        }
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

    const filterInterventions = () => {
        if (!Array.isArray(interventions)) {
            console.warn("Interventions data is not an array.");
            return [];
        }

        let filteredInterventions = interventions.filter(intervention => {
            const searchMatch = search === "" ||
                intervention.abr_projet.toLowerCase().includes(search.toLowerCase()) ||
                intervention.abr_client.toLowerCase().includes(search.toLowerCase()) ||
                intervention.Nom_personnel.toLowerCase().includes(search.toLowerCase());
            return searchMatch;
        });

        switch (navbar[clicked]) {
            case "Faites":
                return filteredInterventions.filter(intervention => intervention.status == 2);
            case "En cours":
                return filteredInterventions.filter(intervention => intervention.status == 1);
            case "Annulées":
                return filteredInterventions.filter(intervention => intervention.status == 0);
            case "Tous":
            default:
                return filteredInterventions;
        }
    };

    const interventionClick = (intervention) => {
        navigation.navigate('Détails Intervention', { intervention });
    };
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.intervention}
            onPress={() => interventionClick(item)}
        >
            <View style={styles.idView}><Text style={styles.id}>N° Intervention : {item.intervention_id}</Text></View>

            <Text style={styles.Project}>{item.abr_projet || 'N/A'}</Text>
            <Text style={styles.client}>Objet : {item.Objet_Projet || 'N/A'}</Text>
            <Text style={styles.client}>Client : {item.abr_client || 'N/A'}</Text>
            <Text style={styles.technicien}>Technicien: {item.Nom_personnel || 'N/A'}</Text>
            <Text style={styles.technicien}>Prestation: {item.libelle || 'N/A'}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                <Text style={styles.status}>Etat : </Text>
                <Text style={item.status == 2 ? styles.valide : (item.status == 0 ? styles.annule : styles.enCours)}>
                    {item.status == 1 ? "En cours" : item.status == 0 ? "Annulée" : "Faite"}
                </Text>
            </View>
            {item.status == "Faite" ? (
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                    <Text style={styles.status}>Etat Réception : </Text>
                    <Text style={item.etat_reception == 1 ? styles.valide : styles.enCours}>{item.etat_reception == 1 ? "Faite" : "En cours"}</Text>
                </View>) : (<></>)}
            <View style={styles.dateView}>
                <Text style={styles.dateText}>{moment(item.date_intervention, "YYYYMMDD").format("DD/MM/YYYY") || 'N/A'}</Text>
            </View>
        </TouchableOpacity>
    );

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
                keyExtractor={(item) => item.intervention_id.toString()}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                contentContainerStyle={styles.pgm}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}
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
    loading: {
        position: "absolute",
        top: "50%",
        left: "50%",
        zIndex: 111
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
        paddingTop: 15,
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
