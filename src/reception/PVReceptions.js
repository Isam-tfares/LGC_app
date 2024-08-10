import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { EvilIcons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import { Ionicons } from '@expo/vector-icons';

export default function PVReceptions({ navigation }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [search, setSearch] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateType, setDateType] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const [pvs, setPvs] = useState([
        {
            id: '1',
            imageUrl: 'https://image.slidesharecdn.com/redactionprojetintervention-100614145220-phpapp02/85/Redaction-d-un-projet-d-intervention-2-320.jpg',
            intervention_id: '12345',
            technicien: 'Technician 1',
            date: '10-08-2024',
        },
        {
            id: '2',
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmrg0q0HVsLfLCDETBJLx8VkpAZiyFNzf3osPqUbTkZnoMr6boCzTuGeJghE2KI9qwVf8&usqp=CAU',
            intervention_id: '67890',
            technicien: 'Technician 2',
            date: '09-08-2024',
        },
        {
            id: '3',
            imageUrl: 'https://image.slidesharecdn.com/redactionprojetintervention-100614145220-phpapp02/85/Redaction-d-un-projet-d-intervention-2-320.jpg',
            intervention_id: '12346',
            technicien: 'Technician 1',
            date: '09-08-2024',
        },
        {
            id: '4',
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmrg0q0HVsLfLCDETBJLx8VkpAZiyFNzf3osPqUbTkZnoMr6boCzTuGeJghE2KI9qwVf8&usqp=CAU',
            intervention_id: '67891',
            technicien: 'Technician 2',
            date: '09-08-2024',
        },
        {
            id: '5',
            imageUrl: 'https://image.slidesharecdn.com/redactionprojetintervention-100614145220-phpapp02/85/Redaction-d-un-projet-d-intervention-2-320.jpg',
            intervention_id: '12345',
            technicien: 'Technician 1',
            date: '08-08-2024',
        },
        {
            id: '6',
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmrg0q0HVsLfLCDETBJLx8VkpAZiyFNzf3osPqUbTkZnoMr6boCzTuGeJghE2KI9qwVf8&usqp=CAU',
            intervention_id: '67890',
            technicien: 'Technician 2',
            date: '08-08-2024',
        },
        {
            id: '7',
            imageUrl: 'https://image.slidesharecdn.com/redactionprojetintervention-100614145220-phpapp02/85/Redaction-d-un-projet-d-intervention-2-320.jpg',
            intervention_id: '12346',
            technicien: 'Technician 1',
            date: '07-08-2024',
        },
        {
            id: '8',
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmrg0q0HVsLfLCDETBJLx8VkpAZiyFNzf3osPqUbTkZnoMr6boCzTuGeJghE2KI9qwVf8&usqp=CAU',
            intervention_id: '67891',
            technicien: 'Technician 2',
            date: '07-08-2024',
        },
    ]);
    useEffect(() => {
        // Initialize dates
        const secondDate = moment().add(7, 'day').format("DD/MM/YYYY");
        const firstDate = moment().subtract(7, 'day').format("DD/MM/YYYY");

        setFromDate(firstDate);
        setToDate(secondDate);
    }, []);

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

    const handlePVClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    const filterInterventions = () => {
        let filteredInterventions = pvs;

        // if (search) {
        //     filteredInterventions = filteredInterventions.filter(intervention =>
        //         intervention.technicien.toLowerCase().includes(search.toLowerCase()) ||
        //         intervention.id.toLowerCase().includes(search.toLowerCase())
        //     );
        // }

        // Convert fromDate and toDate to Date objects
        const fromDateObj = fromDate ? moment(fromDate, "DD-MM-YYYY").toDate() : null;
        const toDateObj = toDate ? moment(toDate, "DD-MM-YYYY").toDate() : null;

        // Convert intervention dates to Date objects
        filteredInterventions = filteredInterventions.filter(intervention => {
            const interventionDate = moment(intervention.date, "DD-MM-YYYY").toDate();

            // Filter by search query
            const searchMatch = search === "" ||
                intervention.technicien.toLowerCase().includes(search.toLowerCase()) ||
                intervention.id.toLowerCase().includes(search.toLowerCase());

            // Filter by date range
            const dateMatch = (!fromDateObj || interventionDate >= fromDateObj) &&
                (!toDateObj || interventionDate <= toDateObj);

            return searchMatch && dateMatch;
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
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.pvCard} onPress={() => handlePVClick(item.imageUrl)}>
                        <Image source={{ uri: item.imageUrl }} style={styles.pvImage} />
                        <View style={styles.pvDetails}>
                            <Text style={styles.pvText}>N° Intervention: {item.id}</Text>
                            <Text style={styles.pvText}>Technician: {item.technicien}</Text>
                            <Text style={styles.pvText}>Date: {moment(item.date, "DD-MM-YYYY").format('DD/MM/YYYY')}</Text>
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
});
