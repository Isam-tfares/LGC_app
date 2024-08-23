import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import moment from 'moment';
import 'moment/locale/fr'; // Import French locale
import { EvilIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import DemandeIntervention from './DemandeIntervention';

function Programme({ navigation, reload, setReload }) {
    const TOKEN = useSelector(state => state.user.token);

    moment.locale('fr');
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [currentDay, setCurrentDay] = useState(moment());
    const [interventions, setInterventions] = useState([]);
    useEffect(() => {
        fetchData();
    }, [currentDay, reload]);
    const onRefresh = useCallback(() => {
        fetchData();
    }, [currentDay, reload]);

    const fetchData = async () => {
        try {
            setRefreshing(true);

            // Format the date as YYYYMMDD
            const dateAPI = parseInt(moment(currentDay).format('YYYYMMDD'));

            const API_URL = 'http://10.0.2.2/LGC_backend/?page=demandesInterventionsTec';
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "date": dateAPI }),
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

            if (data) {
                // console.log("DATA", data);
                setInterventions(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setRefreshing(false); // Ensure loading state is turned off after fetch
        }
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
                intervention.intervention_id.toLowerCase().includes(search.toLowerCase()) ||
                intervention.Nom_personnel.toLowerCase().includes(search.toLowerCase());
            return searchMatch;
        });
        return filteredInterventions;
    };

    const interventionClick = (intervention) => {
        navigation.navigate('Demande Intervention', { intervention });
    };

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View >
                <View style={styles.searchView}>
                    <TextInput placeholder='rechercher' value={search} onChangeText={setSearch}
                        style={styles.searchInput}
                    />
                    <EvilIcons name="search" size={24} color="black"
                        style={styles.searchIcon}
                    />
                </View>
            </View>
            <View style={styles.main}>

                {
                    refreshing ?
                        (<ActivityIndicator color={"#0853a1"} />)
                        :
                        (<FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                />}
                            data={filterInterventions()}
                            keyExtractor={(item) => item.intervention_id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.intervention}
                                    onPress={() => interventionClick(item)}
                                >
                                    <View style={styles.idView}><Text style={styles.id}>N° Intervention : {item.intervention_id}</Text></View>
                                    <Text style={styles.Project}>{item.abr_projet}</Text>
                                    <Text style={styles.client}>Objet : {item.Objet_Projet}</Text>
                                    <Text style={styles.client}>Client : {item.abr_client}</Text>
                                    <Text style={styles.technicien}>Technicien: {item.Nom_personnel}</Text>
                                    <View style={styles.dateView}>
                                        <Text style={styles.dateText}>{moment(item.date_intervention, "YYYYMMDD").format("DD/MM/YYYY") || 'N/A'}</Text>
                                    </View>

                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                            contentContainerStyle={styles.pgm}
                        />)}
            </View>
        </View>
    );
}

const Stack = createStackNavigator();

export default function AddedInterventions() {
    const [reload, setReload] = useState(false);
    return (
        <Stack.Navigator initialRouteName="Demandes Interventions">
            <Stack.Screen
                name="Demandes Interventions"
                component={Programme}
                options={{ headerShown: false }}
                initialParams={{ reload, setReload }}
            />
            <Stack.Screen
                name="Demande Intervention"
                children={(props) => <DemandeIntervention {...props} />}
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
        marginTop: 5
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
        top: 0,
        right: 10
    },
    id: {
        fontSize: 16,
        fontWeight: "bold",

    },
    monthView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 5,
        width: "100%",
    },
    monthText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    plus: {
        position: "absolute",
        bottom: "25%",
        right: "5%",
        zIndex: 20,
    },
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
});
