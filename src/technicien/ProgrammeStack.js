import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import moment from 'moment';
import 'moment/locale/fr'; // Import French locale
import AntDesign from '@expo/vector-icons/AntDesign';
import { createStackNavigator } from '@react-navigation/stack';
import Intervention from './Intervention';
import AddIntervention from './AddIntervention';
import { useSelector } from 'react-redux';

const generateDaysOfMonth = (month, year) => {
    const startOfMonth = moment(`${month} ${year}`, 'MMMM YYYY').startOf('month');
    const endOfMonth = moment(startOfMonth).endOf('month');
    const daysArray = [];

    for (let date = startOfMonth; date.isBefore(endOfMonth); date.add(1, 'day')) {
        daysArray.push(date.clone());
    }

    return daysArray;
};

function Programme({ navigation, reload, setReload }) {
    const TOKEN = useSelector(state => state.user.token);

    moment.locale('fr');
    const technicien = 10;
    const [currentDay, setCurrentDay] = useState(moment());
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [monthSelected, setMonthSelected] = useState(moment().format('MMMM'));
    const [yearSelected, setYearSelected] = useState(moment().format('YYYY'));
    const [interventions, setInterventions] = useState([]);
    const daysOfMonth = generateDaysOfMonth(monthSelected, yearSelected);
    useEffect(() => {
        // setLoading(true);
        fetchData();
    }, [currentDay, reload]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Format the date as YYYYMMDD
            const dateAPI = parseInt(moment(currentDay).format('YYYYMMDD'));

            const API_URL = 'http://10.0.2.2/LGC_backend/?page=Programme';
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
                    data = JSON.parse(text);
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
            setLoading(false); // Ensure loading state is turned off after fetch
        }
    };


    const interventionClick = (intervention) => {
        navigation.navigate('Intervention', { intervention });
    };

    const nextMonth = () => {
        const currentMonth = moment(`${monthSelected} ${yearSelected}`, 'MMMM YYYY');
        const nextMonth = currentMonth.add(1, 'month');
        setMonthSelected(nextMonth.format('MMMM'));
        setYearSelected(nextMonth.format('YYYY'));
    };

    const previousMonth = () => {
        const currentMonth = moment(`${monthSelected} ${yearSelected}`, 'MMMM YYYY');
        const previousMonth = currentMonth.subtract(1, 'month');
        setMonthSelected(previousMonth.format('MMMM'));
        setYearSelected(previousMonth.format('YYYY'));
    };
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={styles.header}>
                <View style={styles.monthView}>
                    <TouchableOpacity onPress={() => { previousMonth() }}>
                        <AntDesign name="left" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.monthText}>{monthSelected} {yearSelected}</Text>
                    <TouchableOpacity onPress={() => { nextMonth() }}>
                        <AntDesign name="right" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    horizontal
                    data={daysOfMonth}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.daysList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={item.isSame(currentDay, 'day') ? styles.currentDay : styles.dayContainer}
                            onPress={() => setCurrentDay(item)}
                        >
                            <Text style={item.isSame(currentDay, 'day') ? styles.day2 : styles.day}>{item.format('D')}</Text>
                            <Text style={item.isSame(currentDay, 'day') ? styles.dayName2 : styles.dayName}>{item.format('ddd')}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <View style={styles.main}>

                {/* add intervention */}
                <TouchableOpacity onPress={() => { setModalVisible(true) }} style={styles.plus} >
                    <AntDesign name="pluscircle" size={40} color="#0853a1" />
                </TouchableOpacity>
                <AddIntervention modalVisible={modalVisible}
                    setModalVisible={setModalVisible} technicien={technicien} />
                {/* end add intervention */}

                {
                    loading ?
                        (<ActivityIndicator color={"#0853a1"} />)
                        :
                        (<FlatList
                            data={interventions}
                            keyExtractor={(item) => item.intervention_id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.intervention}
                                    onPress={() => interventionClick(item)}
                                >
                                    <View style={styles.idView}><Text style={styles.id}>N° Intervention : {item.intervention_id}</Text></View>
                                    <Text style={styles.Project}>{item.abr_projet}</Text>
                                    <Text style={styles.client}>Objet : {item.Objet_projet}</Text>
                                    <Text style={styles.client}>Client : {item.abr_client}</Text>
                                    <Text style={styles.technicien}>Technicien: {item.Nom_personnel}</Text>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                                        <Text style={styles.status}>État : </Text>
                                        <Text style={item.status == 2 ? styles.valide : (item.status == 0 ? styles.annule : styles.enCours)}>{item.status == 1 ? "En cours" : item.status == 2 ? "Faite" : "Annulée"}</Text>
                                    </View>
                                    <View style={styles.dateView}>
                                        <Text style={styles.dateText}>{item.date_intervention}</Text>
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

export default function ProgrammeStack() {
    const [reload, setReload] = useState(false);
    console.log(reload);
    return (
        <Stack.Navigator initialRouteName="ProgrammeScreen">
            <Stack.Screen
                name="ProgrammeScreen"
                component={Programme}
                options={{ headerShown: false }}
                initialParams={{ reload, setReload }}
            />
            <Stack.Screen
                name="Intervention"
                children={(props) => <Intervention {...props} reload={reload} setReload={setReload} />}
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
});
