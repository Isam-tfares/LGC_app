import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Modal, TextInput, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { ConfirmAction } from '../components/utils';
import { BASE_URL, BASE_PVS_URL } from '../components/utils';

export default function PreReceptionDetails({ route, navigation }) {
    const TOKEN = useSelector(state => state.user.token);
    const BASE_URL = useSelector(state => state.baseURL.baseURL);
    const IMAGES_URL = BASE_PVS_URL;
    const ETATS_RECUPERATION = ["Réccupéré", "Non réccupéré"];
    const PRELVES_PAR = ["LGC", "Client"];
    const RECEPETION_TYPES = ["interne", "externe"];
    const ESSAIES = ["Labo", "Chantier"];
    const MODES_CONFECTION = ["Vibration", "Piquage"];
    const MODES_FABRICATION = ["Manuel", "Bétorrière", "central"];
    const BetonPhases = ["1", "2", "4", "35", "44", "45", "46", "47"];

    let { reception } = route.params;

    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [intervention_id, setIntervention_id] = useState(route.params.id ?? null);
    const [receptionState, setReceptionState] = useState(reception);

    const handleGoBack = () => {
        const reload = { reload: true };
        navigation.navigate('Listes Pré-réceptions', { reload });
    };

    const fetchPreReception = async (url, intervention_id, token) => {
        if (intervention_id == null) {
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "intervention_id": intervention_id }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status:  ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                console.log("TEXT", text);
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
            if (data.error && data.error == "Expired token") {
                navigation.navigate("Déconnexion");
                console.log("Log Out");
                return;
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

    useEffect(() => {
        if (receptionState && receptionState.PVPath) {
            setImage(IMAGES_URL + receptionState.PVPath);
        }
    }, [receptionState]);
    useEffect(() => {
        if (intervention_id) {
            console.log("fetch Prereception of intervention_id ", intervention_id);
            const API_URL = `${BASE_URL}/?page=PreReception`;
            fetchPreReception(API_URL, intervention_id, TOKEN);
            navigation.setParams({ id: null });
        }
    }, [intervention_id]);
    useEffect(() => {
        setIntervention_id(route.params.id);
    }, [route.params.id]);

    const closeImageModal = () => {
        setImageModalVisible(null);
    };

    const validateReception = async () => {
        ConfirmAction(
            "Êtes-vous sûr de vouloir valider cette réception?",
            async () => {
                let url = `${BASE_URL}/?page=validatePreReception`;
                setLoading(true);
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${TOKEN}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ "IDPre_reception": receptionState.IDPre_reception })
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
                        Alert.alert("Un problème est survenu lors de la validation de la réception");
                        navigation.navigate("Déconnexion");
                        console.log("Log Out");
                        return;
                    }

                    if (data != null) {
                        if (data == 1) {
                            Alert.alert("Réception validée avec succès");
                            handleGoBack();
                        } else {
                            Alert.alert("Un problème est survenu lors de la validation de la réception");
                        }
                    } else {
                        Alert.alert("Un problème est survenu lors de la validation de la réception");
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setLoading(false);
                }
            }
        );
    };

    const editReception = () => {
        navigation.navigate("Modifier Pré-réception", { receptionState });
    }

    return (
        <ScrollView>
            <View style={styles.container}>

                {/* Loading */}
                {loading ? <View style={styles.loading}><ActivityIndicator size="large" color="#4b6aff" /></View> : null}
                {receptionState && Object.keys(receptionState).length > 0 ?
                    (<View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.title}>Code bar</Text>
                            <Text style={styles.text}>{receptionState.Observation}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.title}>N° Intervention</Text>
                            <Text style={styles.text}>{receptionState.intervention_id}</Text>
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
                            <Text style={styles.title}>Date réception</Text>
                            <Text style={styles.text}>{moment(receptionState.saisiele, "YYYYMMDD").format("DD/MM/YYYY") || 'N/A'}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.title}>Date de début</Text>
                            <Text style={styles.text}>{receptionState.date_debut ?
                                moment(receptionState.date_debut, "YYYYMMDD").format("DD/MM/YYYY") || 'N/A' :
                                ""}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.title}>Date de fin</Text>
                            <Text style={styles.text}>{receptionState.date_fin ?
                                moment(receptionState.date_fin, "YYYYMMDD").format("DD/MM/YYYY") || 'N/A' :
                                ""}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.title}>Date prévus</Text>
                            <Text style={styles.text}>{moment(receptionState.date_prevus, "YYYYMMDD").format("DD/MM/YYYY") || 'N/A'}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.title}>Lieu de prélèvement</Text>
                            <Text style={styles.text}>{receptionState.Lieux_ouvrage}</Text>
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
                            <Text style={styles.text}>{PRELVES_PAR[parseInt(receptionState.prelevement_par) - 1]}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.title}>Type Essaie</Text>
                            <Text style={styles.text}>{ESSAIES[parseInt(receptionState.Essai_valide)]}</Text>
                        </View>
                        {BetonPhases.includes(receptionState.IDPhase) ?
                            <>
                                <View style={styles.row}>
                                    <Text style={styles.title}>Type Béton</Text>
                                    <Text style={styles.text}>{receptionState.TypeBetonLibelle}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.title}>Compression</Text>
                                    <View style={styles.text}>
                                        {receptionState.Compression == 1 ?
                                            <MaterialIcons name="check-box" size={24} color="black" /> :
                                            <MaterialIcons name="check-box-outline-blank" size={24} color="black" />
                                        }
                                    </View>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.title}>Traction</Text>
                                    <View style={styles.text}>
                                        {receptionState.Traction == 1 ?
                                            <MaterialIcons name="check-box" size={24} color="black" /> :
                                            <MaterialIcons name="check-box-outline-blank" size={24} color="black" />
                                        }
                                    </View>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.title}>Traction fend</Text>
                                    <View style={styles.text}>
                                        {receptionState.Traction_fend == 1 ?
                                            <MaterialIcons name="check-box" size={24} color="black" /> :
                                            <MaterialIcons name="check-box-outline-blank" size={24} color="black" />
                                        }
                                    </View>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.title}>Type</Text>
                                    <Text style={styles.text}>{receptionState.Type}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.title}>Mode</Text>
                                    <Text style={styles.text}>{receptionState.Mode}</Text>
                                </View>
                                <View style={styles.row}>
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
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.title}>Nombre des jours</Text>
                                    <Text style={styles.text}>{receptionState.nbr_jrs}</Text>
                                </View>
                            </> :
                            <></>}
                        <View>
                            <Button title="Voir PV" color="blue" onPress={() => { setImageModalVisible(true) }} />
                        </View>
                        {receptionState.etat_confirmation == 0 ?
                            <View style={styles.btns}>
                                <TouchableOpacity style={styles.modalButton} onPress={() => { validateReception() }}>
                                    <Text style={styles.modalButtonText}>Valider</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButtonRefuse} onPress={() => { editReception() }}>
                                    <Text style={styles.modalButtonText}>Modifier</Text>
                                </TouchableOpacity>
                            </View>

                            : <></>}
                    </View>) : null}
            </View>

            {/* PV image */}
            {imageModalVisible ?
                image ?
                    (
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
                    ) :
                    Alert.alert("Image non disponible")
                : null}
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
        // alignItems: 'center',
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
        width: '60%',
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
        top: "25%",
        left: "50%",
        zIndex: 111
    },
    btns: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modalButton: {
        backgroundColor: 'green',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        width: '48%',
        marginBottom: 10,
    },
    modalButtonRefuse: {
        backgroundColor: '#4bacc0',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        width: '48%',
        marginBottom: 10,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
