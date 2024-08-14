import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Modal, TextInput, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import moment from 'moment';

export default function PreReceptionDetails({ route, navigation }) {
    const TOKEN = useSelector(state => state.user.token); // Move this line inside the component
    let { reception } = route.params;

    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [receptionState, setReceptionState] = useState(reception);


    if (route.params.id) {
        console.log("fetch Prereception of intervention_id", route.params.id);
        fetchPreReception(route.params.id, TOKEN);
    }
    const closeImageModal = () => {
        setImageModalVisible(null);
    };

    const fetchPreReception = async (IDPre_reception, token) => {
        setLoading(true);
        const API_URL = 'http://10.0.2.2/LGC_backend/?page=PreReception';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "IDPre_reception": IDPre_reception }),
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

            // check if data is Object
            if (typeof data === 'object' && data !== null) {
                setReceptionState(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setLoading(false);
        }
    };
    return (
        <ScrollView>
            <View style={styles.container}>

                {/* Loading */}
                {loading ? <View style={styles.loading}><ActivityIndicator size="large" color="#4b6aff" /></View> : null}

                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.title}>Code Bar</Text>
                        <Text style={styles.text}>{receptionState.Observation}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Client</Text>
                        <Text style={styles.text}>{receptionState.abr_client}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Projet</Text>
                        <Text style={styles.text}>{receptionState.abr_projet}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Technicien</Text>
                        <Text style={styles.text}>{receptionState.PersonnelNom}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Prestation</Text>
                        <Text style={styles.text}>{receptionState.PhaseLibelle}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Material</Text>
                        <Text style={styles.text}>{receptionState.MateriauxLibelle}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Date création</Text>
                        <Text style={styles.text}>{moment(receptionState.saisiele, "YYYYMMDD").format("DD/MM/YYYY") || 'N/A'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Lieu de prélèvement</Text>
                        <Text style={styles.text}>{moment(receptionState.Lieux_ouvrage, "YYYYMMDD").format("DD/MM/YYYY") || 'N/A'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Nombre echantillon</Text>
                        <Text style={styles.text}>{receptionState.nombre}</Text>
                    </View>
                    {/* <View style={styles.row}>
                        <Text style={styles.title}>Etat de récupération </Text>
                        <Text style={styles.text}>{receptionState.etat_recuperation}</Text>
                    </View> */}
                    <View style={styles.row}>
                        <Text style={styles.title}>Prélevé par</Text>
                        <Text style={styles.text}>{receptionState.prelevement_par}</Text>
                    </View>
                    {/* <View style={styles.row}>
                        <Text style={styles.title}>Type Essaie</Text>
                        <Text style={styles.text}>{receptionState.essaie}</Text>
                    </View> */}
                    <View style={styles.row}>
                        <Text style={styles.title}>Type Béton</Text>
                        <Text style={styles.text}>{receptionState.Beton}</Text>
                    </View>
                    {/* <View style={styles.row}>
                        <Text style={styles.title}>Slump</Text>
                        <Text style={styles.text}>{receptionState.slump}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Central</Text>
                        <Text style={styles.text}>{receptionState.central}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>BL</Text>
                        <Text style={styles.text}>{receptionState.BL}</Text>
                    </View> */}
                    {/* <View style={styles.row}>
                        <Text style={styles.title}>Nombre des jours</Text>
                        <Text style={styles.text}>{receptionState.nbr_jrs}</Text>
                    </View> */}
                    <View style={{ marginBottom: 10 }}>
                        <Button color="blue" onPress={() => setImageModalVisible(true)} title="Voir PV" />
                    </View>
                    <View>
                        <Button color="blue" onPress={() => Alert.alert('Valider Prereception')} title="Valider Prereception" />
                    </View>
                </View>
            </View>

            {/* PV image */}
            {imageModalVisible && (
                <Modal visible={true} transparent={true} onRequestClose={closeImageModal}>
                    <View style={styles.modalContainer}>
                        <View style={styles.relativeView}>
                            <Image source={{ uri: image }} style={styles.fullScreenImage} />
                            <TouchableOpacity style={styles.close}
                                onPress={closeImageModal}
                            >
                                <Ionicons name="close-circle-sharp" size={40} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>

                </Modal>
            )}
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingEnd: 5,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        paddingEnd: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        width: '70%',
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
    loading: {
        position: "absolute",
        top: "50%",
        left: "50%",
        zIndex: 111
    },
});
