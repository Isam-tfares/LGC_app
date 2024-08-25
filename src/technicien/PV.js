import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';

export default function PV({ navigation, route }) {
    const TOKEN = useSelector(state => state.user.token);

    const [refreshing, setRefreshing] = useState(false);
    const [selectedIntervention, setSelectedIntervention] = useState(route.params ? Number.parseInt(route.params.id) : "");
    const [image, setImage] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [interventions, setInterventions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchInterventions();
    }, [])
    const onRefresh = useCallback(() => {
        fetchInterventions();
    }, [refreshing]);
    useEffect(() => {
        if (Number.isInteger(selectedIntervention)) {
            setSelectedIntervention(selectedIntervention);
        }
    }, [selectedIntervention]);

    const fetchInterventions = async () => {
        let url = "http://192.168.43.88/LGC_backend/?page=interventionsWithoutPV";
        setRefreshing(true);
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                },
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
                data = JSON.parse(text);
            }
            if (data.error && data.error == "Expired token") {
                navigation.navigate("Déconnexion");
                console.log("Log Out");
                return;
            }
            if (Object.keys(data)) {
                setInterventions(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setRefreshing(false);
        }
    };

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de sélectionner une image.');
        }
    };

    const removeImage = () => {
        setImage(null);
    };
    const insertPV = async (url, token) => {
        const formData = new FormData();
        formData.append('intervention_id', selectedIntervention);

        const fileName = image.split('/').pop();
        const fileType = fileName.split('.').pop();

        formData.append('image', {
            uri: image,
            name: fileName,
            type: `image/${fileType}`,
        });

        setLoading(true);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
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
                console.log("TEXT", text)
                data = JSON.parse(text);
            }
            if (data.error && data.error == "Expired token") {
                Alert.alert("Un problème est survenu lors de l'ajout du PV");
                navigation.navigate("Déconnexion");
                console.log("Log Out");
                return;
            }
            if (data) {
                Alert.alert("Réception ajoutée avec succès ");
                fetchInterventions();
            } else {
                Alert.alert("Un problème est survenu lors de l'ajout du PV");
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrepareData = () => {
        if (!selectedIntervention) {
            Alert.alert('Erreur', 'Veuillez sélectionner une intervention.');
            return;
        }
        if (!image) {
            Alert.alert('Erreur', 'Veuillez charger une image. ');
            return;
        }
        insertPV('http://192.168.43.88/LGC_backend/?page=newPV', TOKEN);
        setSelectedIntervention('');
        setImage(null);
        setSelectedDate(new Date());
    };

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Ajouter PV</Text>
                <View style={styles.card}>
                    <Text style={styles.label}>Intervention</Text>
                    <Picker
                        selectedValue={selectedIntervention}
                        onValueChange={(itemValue, itemIndex) => setSelectedIntervention(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="N° Intervention " value="" />
                        {interventions && interventions.map((intervention, index) => (
                            <Picker.Item key={index} label={intervention.intervention_id} value={intervention.intervention_id} />
                        ))}
                    </Picker>

                    {/* Loading */}
                    {loading ? <View style={styles.loading}><ActivityIndicator size="large" color="#4b6aff" /></View> : null}

                    <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
                        {image ? (
                            <>
                                <Image source={{ uri: image }} style={styles.image} />
                                <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
                                    <Ionicons name="close-circle" size={24} color="red" />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Ionicons name="cloud-upload" size={50} color="black" />
                                <Text style={styles.text}>Charger PV</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button2} onPress={handlePrepareData}>
                        <Text style={styles.buttonText2}>Ajouter</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
        width: '100%',
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        fontWeight: 'bold',
        marginBottom: 20,
    },
    picker: {
        width: '100%',
        height: 50,
        marginBottom: 20,
    },
    uploadArea: {
        borderRadius: 10,
        borderStyle: 'dashed',
        borderWidth: 1,
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    text: {
        textAlign: "center",
        fontSize: 18,
        color: "#333"
    },
    button: {
        // backgroundColor: '#4bacc0',
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    button2: {
        backgroundColor: '#4bacc0',
        // backgroundColor: '#f0f0f0',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    buttonText: {
        color: '#444',
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonText2: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    removeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#4bacc0',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        width: '100%',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    loading: {
        position: "absolute",
        top: "50%",
        left: "50%",
        zIndex: 111
    },
});
