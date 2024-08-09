import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import moment from 'moment';
import 'moment/locale/fr'; // Import French locale for month names
import Ionicons from '@expo/vector-icons/Ionicons';

import Fontisto from '@expo/vector-icons/Fontisto';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DemandeCongeDetails from './DemandeCongeDetails';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function formatDate(inputDate) {
    // Parse the date using moment
    const date = moment(inputDate, "DD/MM/YYYY");

    // Format the date to the desired format
    const day = date.format('D');
    const month = date.format('MMM');
    const year = date.format('YY');

    // Return the formatted string
    return { "day": day, "month": month, "year": year };
}
console.log(formatDate("10/08/2024").day, formatDate("10/08/2024").month, formatDate("10/08/2024").year);
function Conges({ route, navigation }) {

    const [clicked, setClicked] = useState(1);
    const [dateType, setDateType] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [congesData, setCongesData] = useState([
        {
            id: 1,
            fullname: "Alice Dupont",
            conge_type: "Congé payé",
            imageUrl: null,
            date_debut: "10/08/2024",
            date_fin: "20/08/2024",
            date_demande: "07/08/2024",
            nbr_days: 10,
            status: "Accepté",
            obs: null,
            user_type: "Technicien"
        },
        {
            id: 2,
            fullname: "Bob Martin",
            conge_type: "Congé maladie",
            imageUrl: null,
            date_debut: "12/08/2024",
            date_fin: "15/08/2024",
            date_demande: "06/08/2024",
            nbr_days: 4,
            status: "Accepté",
            obs: null,
            user_type: "Technicien"
        },
        {
            id: 3,
            fullname: "Charlie Brown",
            conge_type: "Congé maternité",
            imageUrl: null,
            date_debut: "12/08/2024",
            date_fin: "01/09/2024",
            date_demande: "05/08/2024",
            nbr_days: 21,
            status: "Accepté",
            obs: null,
            user_type: "Technicien"
        },
        {
            id: 4,
            fullname: "Diana Prince",
            conge_type: "Congé sans solde",
            imageUrl: null,
            date_debut: "01/09/2024",
            date_fin: "10/09/2024",
            date_demande: "04/08/2024",
            nbr_days: 10,
            status: "Accepté",
            obs: null,
            user_type: "Technicien"
        },
        {
            id: 5,
            fullname: "Evan Harris",
            conge_type: "Congé parental",
            imageUrl: null,
            date_debut: "05/09/2024",
            date_fin: "25/09/2024",
            date_demande: "03/08/2024",
            nbr_days: 21,
            status: "Accepté",
            obs: null,
            user_type: "Technicien"
        },
        {
            id: 6,
            fullname: "Fiona Green",
            conge_type: "Congé sabbatique",
            imageUrl: null,
            date_debut: "01/09/2024",
            date_fin: "10/09/2024",
            date_demande: "02/08/2024",
            nbr_days: 10,
            status: "Accepté",
            obs: null,
            user_type: "Technicien"
        },
        {
            id: 7,
            fullname: "George Black",
            conge_type: "Congé payé",
            imageUrl: null,
            date_debut: "10/09/2024",
            date_fin: "20/09/2024",
            date_demande: "05/08/2024",
            nbr_days: 10,
            status: "Accepté",
            obs: null,
            user_type: "Technicien"
        },
        {
            id: 8,
            fullname: "Hannah White",
            conge_type: "Congé maladie",
            imageUrl: null,
            date_debut: "15/09/2024",
            date_fin: "20/09/2024",
            date_demande: "10/08/2024",
            nbr_days: 5,
            status: "Accepté",
            obs: null,
            user_type: "Technicien"
        },
        {
            id: 9,
            fullname: "Ian Blue",
            conge_type: "Congé payé",
            imageUrl: null,
            date_debut: "01/10/2024",
            date_fin: "10/10/2024",
            date_demande: "01/08/2024",
            nbr_days: 10,
            status: "Refusé",
            obs: "Budget limité pour les congés payés.",
            user_type: "Technicien"
        },
        {
            id: 10,
            fullname: "Jack Red",
            conge_type: "Congé maternité",
            imageUrl: null,
            date_debut: "15/10/2024",
            date_fin: "30/10/2024",
            date_demande: "07/08/2024",
            nbr_days: 15,
            status: "Refusé",
            obs: "Documents médicaux manquants."
            , user_type: "Technicien"
        },
        {
            id: 11,
            fullname: "Kelly Green",
            conge_type: "Congé parental",
            imageUrl: null,
            date_debut: "01/11/2024",
            date_fin: "10/11/2024",
            date_demande: "08/08/2024",
            nbr_days: 10,
            status: "En attente",
            obs: null,
            user_type: "Technicien"
        },
        {
            id: 12,
            fullname: "Liam Grey",
            conge_type: "Congé sabbatique",
            imageUrl: null,
            date_debut: "15/11/2024",
            date_fin: "25/11/2024",
            date_demande: "09/08/2024",
            nbr_days: 10,
            status: "En attente",
            obs: null,
            user_type: "Technicien"
        }
    ]);
    useEffect(() => {
        // Initialize dates
        const today = moment().format("DD/MM/YYYY");
        const oneMonthAgo = moment().subtract(1, 'month').format("DD/MM/YYYY");

        setFromDate(oneMonthAgo);
        setToDate(today);
    }, []);

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
    const filterData = () => {
        // Parse fromDate and toDate to moment objects
        const from = fromDate ? moment(fromDate, "DD/MM/YYYY") : null;
        const to = toDate ? moment(toDate, "DD/MM/YYYY") : null;

        return congesData.filter(conge => {
            const dateDemande = moment(conge.date_demande, "DD/MM/YYYY");

            // Check if the dateDemande falls within the fromDate and toDate range
            const isWithinDateRange = (!from || dateDemande.isSameOrAfter(from)) &&
                (!to || dateDemande.isSameOrBefore(to));

            // Filter by status and date range
            if (clicked === 1) { // En attente
                return conge.status === "En attente" && isWithinDateRange;
            } else if (clicked === 2) { // Accepté
                return conge.status === "Accepté" && isWithinDateRange;
            } else if (clicked === 3) { // Refusé
                return conge.status === "Refusé" && isWithinDateRange;
            } else {
                return isWithinDateRange; // If no filter is selected, return by date range only
            }
        });
    };


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
                    {filterData(congesData).map((conge, index) => (
                        <TouchableOpacity key={index} onPress={() => { DemandeCongeClick(conge) }}>
                            <View style={styles.conge}>
                                <View style={styles.box}>
                                    {conge.imageUrl ?
                                        (<Image source={{ uri: conge.imageUrl }} style={{ width: 50, height: 50, borderRadius: 25 }} />) :
                                        (<Image source={require('../../assets/profile.jpeg')} style={{ width: 50, height: 50, borderRadius: 25 }} />)
                                    }
                                    <View>
                                        <Text style={styles.textInfo}>{conge.fullname}</Text>
                                        <Text style={styles.conge_type}>{conge.conge_type}</Text>
                                    </View>
                                </View>
                                <View style={styles.box}>
                                    <View style={styles.dateView}>
                                        <Text style={styles.day}>{formatDate(conge.date_debut).day}</Text>
                                        <Text style={styles.monthyear}>{formatDate(conge.date_debut).month} {formatDate(conge.date_debut).year}</Text>
                                    </View>
                                    <View style={{ padding: 5 }}>
                                        <Ionicons name="arrow-forward" size={24} color="#888" />
                                    </View>
                                    <View style={styles.dateView}>
                                        <Text style={styles.day}>{formatDate(conge.date_fin).day}</Text>
                                        <Text style={styles.monthyear}>{formatDate(conge.date_fin).month} {formatDate(conge.date_fin).year}</Text>
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
    return (
        <Stack.Navigator initialRouteName="Conges">
            <Stack.Screen
                name="Conges"
                component={Conges}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Détails Demande Congé"
                component={DemandeCongeDetails}
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
    conge_type: {
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

