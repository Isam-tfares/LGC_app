import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, RefreshControl } from 'react-native';
import moment from 'moment';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AddIntervention from './AddIntervention';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../components/utils';

export default function InterventionsNotDone({ navigation, route }) {
    const TOKEN = useSelector(state => state.user.token); // Move this line inside the component

    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [dateType, setDateType] = useState('');
    const [clicked, setClicked] = useState(0);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [fromDateAPI, setFromDateAPI] = useState(null);
    const [toDateAPI, setToDateAPI] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [interventions, setInterventions] = useState([]);
    const [isFetchData, setFetchData] = useState(route.params.fetchData || false)

    const onRefresh = useCallback(() => {
        if (isFetchData) {
            const API_URL = `${BASE_URL}/?page=interventionsNotDone`;
            fetchData(API_URL, TOKEN);
        }
    }, [fromDateAPI, toDateAPI, isFetchData]);

    useEffect(() => {
        // Initialize dates
        const secondDate = moment().format("DD/MM/YYYY");
        const firstDate = moment().subtract(1, 'month').format("DD/MM/YYYY");

        setFromDateAPI(parseInt(moment(firstDate, "DD/MM/YYYY").format("YYYYMMDD")));
        setToDateAPI(parseInt(moment(secondDate, "DD/MM/YYYY").format("YYYYMMDD")));
        setFromDate(firstDate);
        setToDate(secondDate);
    }, []);
    useEffect(() => {
        if (isFetchData) {
            const API_URL = `${BASE_URL}/?page=interventionsNotDone`;
            fetchData(API_URL, TOKEN);
        }
    }, [fromDateAPI, toDateAPI, isFetchData]);

    const fetchData = async (url, token) => {
        if (!fromDateAPI || !toDateAPI) return;
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
                    console.error('Error parsing JSON: ', error);
                    // Handle non-JSON data if necessary
                    return;
                }
            }
            if (data.error && data.error == "Expired token") {
                navigation.navigate("Déconnexion");
                console.log("Log Out");
                return;
            }
            if (data) {
                setInterventions(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setRefreshing(false);
        }
    };

    // Show date picker
    const showDatePicker = (type) => {
        setDateType(type);
        setDatePickerVisibility(true);
    };

    // Hide date picker
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

        return filteredInterventions;
    };


    const interventionClick = (intervention) => {
        navigation.navigate('Intervention', { intervention });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.intervention}
            onPress={() => interventionClick(item)}
        >
            <View style={styles.idView}>
                <Text style={styles.id}>N° Intervention : {item.intervention_id || 'N/A'}</Text>
            </View>
            <Text style={styles.Project}>{item.abr_projet || 'N/A'}</Text>
            <Text style={styles.abr_client}>Objet : {item.Objet_Projet || 'N/A'}</Text>
            <Text style={styles.abr_client}>Client : {item.abr_client || 'N/A'}</Text>
            <Text style={styles.technicien}>Technicien: {item.Nom_personnel || 'N/A'}</Text>
            <Text style={styles.technicien}>Prestation: {item.libelle || 'N/A'}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                <Text style={styles.status}>Etat : </Text>
                <Text style={item.status == 2 ? styles.valide : (item.status == 0 ? styles.annule : styles.enCours)}>
                    {item.status == 1 ? "En cours" : item.status == 0 ? "Annulée" : "Faite"}
                </Text>
            </View>
            <View style={styles.dateView}>
                <Text style={styles.dateText}>{moment(item.date_intervention, "YYYYMMDD").format("DD/MM/YYYY") || 'N/A'}</Text>
            </View>
        </TouchableOpacity>
    );


    return (
        <View style={{ flex: 1, backgroundColor: "white", position: "relative" }}>

            {/* add intervention */}
            <TouchableOpacity onPress={() => { setModalVisible(true) }} style={styles.plus} >
                <AntDesign name="pluscircle" size={40} color="#0853a1" />
            </TouchableOpacity>
            <AddIntervention modalVisible={modalVisible}
                setModalVisible={setModalVisible} />
            {/* end add intervention */}

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
            <FlatList
                data={filterInterventions()}
                keyExtractor={(item) => item.intervention_id.toString()}
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
    navBar: {
        backgroundColor: "#eee",
        marginBottom: 10,
        marginHorizontal: 10,
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
    idView: {
        position: "absolute",
        top: 10,
        right: 10
    },
    id: {
        fontSize: 16,
        fontWeight: "bold",

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
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    Project: {
        fontWeight: "bold",
        fontSize: 22,
        paddingTop: 15,
    },
    abr_client: {
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
        color: "#0853a1",
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
    },
    picker: {
        width: '94%',
        paddingHorizontal: 10,
        backgroundColor: "#f2f2f2",
        borderRadius: 25,
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
