import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, TextInput, RefreshControl } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { EvilIcons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { BASE_URL, BASE_PVS_URL } from '../components/utils';

export default function PVReceptions({ navigation }) {
    const TOKEN = useSelector(state => state.user.token);
    const BASE_URL = useSelector(state => state.baseURL.baseURL); // Move this line inside the component
    const IMAGES_URL = BASE_PVS_URL;

    const [refreshing, setRefreshing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [search, setSearch] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateType, setDateType] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [fromDateAPI, setFromDateAPI] = useState(null);
    const [toDateAPI, setToDateAPI] = useState(null);

    const [pvs, setPvs] = useState([]);
    useEffect(() => {
        // Initialize dates
        const secondDate = moment().format("DD/MM/YYYY");
        const firstDate = moment().subtract(7, 'day').format("DD/MM/YYYY");

        setFromDateAPI(parseInt(moment(firstDate, "DD/MM/YYYY").format("YYYYMMDD")));
        setToDateAPI(parseInt(moment(secondDate, "DD/MM/YYYY").format("YYYYMMDD")));
        setFromDate(firstDate);
        setToDate(secondDate);
    }, []);
    useEffect(() => {
        const API_URL = `${BASE_URL}/?page=PVs`;

        fetchData(API_URL, TOKEN);
    }, [fromDateAPI, toDateAPI]);
    const onRefresh = useCallback(() => {
        const API_URL = `${BASE_URL}/?page=PVs`;
        fetchData(API_URL, TOKEN);
    }, [fromDateAPI, toDateAPI]);
    const fetchData = async (url, token) => {
        try {
            if (!fromDateAPI || !toDateAPI) return;
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
                    }
                    else {
                        data = [];
                    }
                } catch (error) {
                    console.error(' Error parsing JSON:', error);
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
                setPvs(data);
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

    const handlePVClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    const filterInterventions = () => {
        let filteredInterventions = pvs;

        // Convert intervention dates to Date objects
        filteredInterventions = filteredInterventions.filter(intervention => {
            // Filter by search query
            const searchMatch = search === "" ||
                intervention.technicien_id.toLowerCase().includes(search.toLowerCase()) ||
                intervention.intervention_id.toLowerCase().includes(search.toLowerCase());
            return searchMatch;
        });

        return filteredInterventions;
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchView}>
                <TextInput
                    placeholder='Search'
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
                data={filterInterventions()}
                keyExtractor={(item) => item.intervention_id}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.pvCard} onPress={() => handlePVClick(IMAGES_URL + item.image_path)}>
                        <Image source={{ uri: IMAGES_URL + item.image_path }} style={styles.pvImage} />
                        <View style={styles.pvDetails}>
                            <Text style={styles.pvText}>N° Intervention: {item.intervention_id}</Text>
                            <Text style={styles.pvText}>Technician: {item.Nom_personnel}</Text>
                            <Text style={styles.pvText}>Date: {moment(item.date_creation, "YYYYMMDD").format("DD/MM/YYYY") || 'N/A'}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />

            {selectedImage && (
                <Modal visible={true} transparent={true} onRequestClose={closeImageModal}>
                    <View style={styles.modalContainer}>
                        <View style={styles.relativeView}>
                            <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} />
                            <TouchableOpacity style={styles.close}
                                onPress={closeImageModal}
                            >
                                <Ionicons name="close-circle-sharp" size={40} color="red" />
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={styles.closeButton} onPress={closeImageModal}>
                                <Text style={styles.closeButtonText}>X</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>

                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    searchInput: {
        backgroundColor: "white",
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
    datePickerButton: {
        backgroundColor: "#007BFF",
        padding: 10,
        marginBottom: 10,
        margin: 10,
        borderRadius: 25,
        alignItems: 'center',
    },
    datePickerButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    pvCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    pvImage: {
        width: 60,
        height: 60,
        borderRadius: 5,
    },
    pvDetails: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    pvText: {
        fontSize: 16,
        color: '#333',
    },
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        flex: 1,
    },
    relativeView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: "relative",
    },
    fullScreenImage: {
        width: '90%',
        height: '70%',
        borderRadius: 10,
    },
    closeButton: {
        position: 'absolute',
        top: "14%",
        right: '4%',
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 10
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    close: {
        position: "absolute",
        top: "13%",
        right: '1%',
        backgroundColor: "#fff",
        borderRadius: 100
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
    }
});
