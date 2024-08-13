import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import moment from 'moment';
import 'moment/locale/fr'; // Import French locale for month names
import Ionicons from '@expo/vector-icons/Ionicons';
import Fontisto from '@expo/vector-icons/Fontisto';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DemandeCongeDetails from './DemandeCongeDetails';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

const Stack = createStackNavigator();

function formatDate(inputDate) {
    // Parse the date using moment
    const date = moment(inputDate, "YYYYMMDD")

    // Format the date to the desired format
    const day = date.format('D');
    const month = date.format('MMM');
    const year = date.format('YY');

    // Return the formatted string
    return { "day": day, "month": month, "year": year };
}
console.log(formatDate("10/08/2024").day, formatDate("10/08/2024").month, formatDate("10/08/2024").year);
function Conges({ navigation, route, reload, setReload }) {
    const TOKEN = useSelector(state => state.user.token);

    const [clicked, setClicked] = useState(1);
    const [dateType, setDateType] = useState('');
    const [fromDate, setFromDate] = useState(moment().subtract(1, 'month').format("DD/MM/YYYY"));
    // const [reload, setReload] = useState(false);
    const [toDate, setToDate] = useState(moment().format("DD/MM/YYYY"));
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [congesData, setCongesData] = useState([]);
    useEffect(() => {
        fetchData();
    }, [fromDate, toDate, reload]);

    const fetchData = async () => {
        try {
            const API_URL = 'http://10.0.2.2/LGC_backend/?page=DemandesConges';
            const fromDateAPI = parseInt(moment(fromDate, "DD/MM/YYYY").format('YYYYMMDD'));
            const toDateAPI = parseInt(moment(toDate, "DD/MM/YYYY").format('YYYYMMDD'));
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "fromDate": fromDateAPI, "toDate": toDateAPI }),
            });

            if (!response.ok) {
                throw new Error(` HTTP error! Status: ${response.status}`);
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
                    console.error('Error  parsing JSON:', error);
                    // Handle non-JSON data if necessary
                    return;
                }
            }

            if (data) {
                // console.log(data);
                setCongesData(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const DemandeCongeClick = (demande) => {
        navigation.navigate('Détails Demande Congé', { demande });
    }
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
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        if (dateType === 'from') {
            setFromDate(formattedDate);
        } else {
            if (!validateDateRange(formattedDate)) {
                Alert.alert("Plage de dates non valide", "La date  De  doit être antérieure ou égale à la date  À .");
            }
            else {
                setToDate(formattedDate);
            }
        }
        hideDatePicker();
    };
    const filterConges = (conges) => {
        if (clicked == 1) {
            return conges.filter(conge => conge.etat_demande == 1);
        } else if (clicked == 2) {
            return conges.filter(conge => conge.etat_demande == 2);
        } else {
            return conges.filter(conge => conge.etat_demande == 0);
        }
    }
    return (
        <View style={styles.container}>
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

            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => { setClicked(1) }} style={styles.liView}>
                    <Text style={[styles.liText, clicked == 1 ? styles.clicked : {}]}>En attente</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setClicked(2) }} style={styles.liView}>
                    <Text style={[styles.liText, clicked == 2 ? styles.clicked : {}]}>Acceptés</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setClicked(3) }} style={styles.liView}>
                    <Text style={[styles.liText, clicked == 3 ? styles.clicked : {}]}>Refusés</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View style={styles.demandesView}>
                    {filterConges(congesData)?.map((conge, index) => (
                        <TouchableOpacity key={index} onPress={() => { DemandeCongeClick(conge) }}>
                            <View style={styles.conge}>
                                <View style={[styles.box, { width: "60%" }]}>
                                    {conge.imageUrl ?
                                        (<Image source={{ uri: conge.imageUrl }} style={{ width: 50, height: 50, borderRadius: 25 }} />) :
                                        (<Image source={require('../../assets/profile.jpeg')} style={{ width: 50, height: 50, borderRadius: 25 }} />)
                                    }
                                    <View style={{ flexWrap: "wrap" }}>
                                        <Text style={styles.textInfo}>{conge.Nom_personnel}</Text>
                                        <Text style={styles.labelle}>{conge.labelle}</Text>
                                    </View>
                                </View>
                                <View style={[styles.box, { width: "40%" }]}>
                                    <View style={styles.dateView}>
                                        <Text style={styles.day}>{formatDate(conge.start_date).day}</Text>
                                        <Text style={styles.monthyear}>{formatDate(conge.start_date).month} {formatDate(conge.start_date).year}</Text>
                                    </View>
                                    <View style={{ padding: 5 }}>
                                        <Ionicons name="arrow-forward" size={24} color="#888" />
                                    </View>
                                    <View style={styles.dateView}>
                                        <Text style={styles.day}>{formatDate(conge.end_date).day}</Text>
                                        <Text style={styles.monthyear}>{formatDate(conge.end_date).month} {formatDate(conge.end_date).year}</Text>
                                    </View>
                                </View>

                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

export default function CongesStack() {
    const [reload, setReload] = useState(false);
    return (
        <Stack.Navigator initialRouteName="Conges">
            <Stack.Screen
                name="Conges"
                component={Conges}
                options={{ headerShown: false }}
                initialParams={{ reload, setReload }}
            />

            <Stack.Screen
                name="Détails Demande Congé"
                children={(props) => <DemandeCongeDetails {...props} reload={reload} setReload={setReload} />}
            />

        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
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
    headerContainer: {
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    liView: {
        width: "33.3%",
        alignItems: "center",
    },
    liText: {
        fontSize: 18,
        fontWeight: "bold",
        padding: 5,
        paddingBottom: 10,
    },
    clicked: {
        borderBottomColor: "#4b6aff",
        borderBottomWidth: 2,
    },

    conge: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
    },
    box: {
        flexDirection: "row",
        alignItems: "center",
    },
    dateView: {
        flexDirection: "column",
        alignItems: "center",
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 5,
    },
    textInfo: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },
    labelle: {
        fontSize: 14,
        marginLeft: 10,
        color: "#7a7a7a",
    },
    demandesView: {
        marginBottom: 30,
        paddingBottom: 30,
    },
    day: {
        fontSize: 16,
        fontWeight: "bold",
    },
    monthyear: {
        fontSize: 12,
        color: "#7a7a7a",
    }

});

