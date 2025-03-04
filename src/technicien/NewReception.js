import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Checkbox from 'expo-checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { setReceptionData, clearInterventionData } from '../actions/receptionDataActions';
import { ConfirmAction } from '../components/utils';


//NewReceptionInterface
export default function NewReception({ route, navigation }) {
    const TOKEN = useSelector(state => state.user.token);
    const BASE_URL = useSelector(state => state.baseURL.baseURL);
    const BetonPhases = ["1", "2", "4", "35", "44", "45", "46", "47"];
    const dispatch = useDispatch();

    const [refreshing, setRefreshing] = useState(false);
    const [interventions, setInterventions] = useState(useSelector(state => state.data.interventions));
    const [selectedIntervention, setSelectedIntervention] = useState(route.params ? Number.parseInt(route.params.id) : "");
    const [intervention, setInterevntion] = useState(selectedIntervention ? interventions ? interventions.find(item => item.id === selectedIntervention) : null : null);
    const [clients, setClients] = useState(useSelector(state => state.data.clients));
    const [projects, setProjects] = useState(useSelector(state => state.data.projects));
    const [projectsPicker, setProjectsPicker] = useState([]);
    const [prestations, setPrestations] = useState(useSelector(state => state.data.phases));
    const [materiaux, setMateriaux] = useState(useSelector(state => state.data.materiaux));
    const [types_beton, setTypes_beton] = useState(useSelector(state => state.data.types_beton));
    const [nature_echantillons, setNatures_echantillon] = useState(useSelector(state => state.data.natures_echantillon));
    const etats_recuperation = ["Réccupéré", "Non réccupéré"];
    const preleves = ["Client", "LGC"];
    const receptions_types = ["interne", "externe"];
    const essaies = ["Labo", "Chantier"];
    const modes_confection = ["Vibration", "Piquage"];
    const modes_fabrication = ["Manuel", "Bétorrière", "central"];
    const cylindres = [241, 242, 243, 244];
    const [showenSections, setShowenSections] = useState(["client", "Materiaux", "Béton", "Details"]);
    const [selectedClient, setSelectedClient] = useState(intervention ? intervention.abr_client : "");
    const [selectedProject, setSelectedProject] = useState(intervention ? intervention.abr_projet : "");
    const [selectedPrestation, setSelectedPrestation] = useState(intervention ? intervention.libelle : "");
    const [selectedMatiere, setSelectedMatiere] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDate2, setSelectedDate2] = useState(null);
    const [selectedCylindre, setSelectedCylindre] = useState(cylindres[0]);
    const [nbr_echatillon, setNbr_echatillon] = useState(0);
    const [etat_recuperation, setEtat_recuperation] = useState('Réccupéré');
    const [preleve, setPreleve] = useState('LGC');
    const [Essaie, setEssaie] = useState("Labo");
    const [reception_type, setReception_type] = useState("interne");
    const [betonSelected, setBetonSelected] = useState("");
    const [slump, setSlump] = useState("");
    const [compression, setCompression] = useState(false);
    const [fendage, setfendage] = useState(false);
    const [flexion, setFlexion] = useState(false);
    const [confectionSelected, setConfectionSelected] = useState("Vibration");
    const [fabricationSelected, setFabricationSelected] = useState("Manuel");
    const [centralSelected, setCentralSelected] = useState("");
    const [BL, setBL] = useState("");
    const [nbr_jrs, setNbr_jrs] = useState([7, 28]);
    const [jrs, setJrs] = useState("");
    const [lieu_prelevement, setLieu_prelevement] = useState(intervention ? intervention.Lieux_ouvrage : "");
    const [nature_echantillon, setNature_echantillon] = useState("");
    const [obs, setObs] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
    const [isBetonSectionVisible, setBetonSectionVisibility] = useState(true);

    useEffect(() => {
        if (route.params) {
            setSelectedIntervention(Number.parseInt(route.params.id));
        }
    }, [route.params])
    useEffect(() => {
        getData();
    }, []);
    const onRefresh = useCallback(() => {
        getData();
    }, []);
    useEffect(() => {
        if (selectedIntervention && interventions) {
            // set client and project and prestation of this intervention
            const selected = interventions ? interventions.find(item => item.intervention_id == selectedIntervention) : null;
            if (selected) {
                setSelectedProject(selected ? selected.IDProjet : "");
                let client_id = projects.find(project => project.IDProjet === selected.IDProjet).IDClient;
                setSelectedClient(client_id);
                setSelectedPrestation(selected ? selected.IDPhase : "");
                setLieu_prelevement(selected ? selected.Lieux_ouvrage : "");
            }
            else {
                console.log("None")
            }
        }
    }, [selectedIntervention]);
    // filter projects that part of clientSelected
    useEffect(() => {
        if (selectedClient && projects) {
            const filteredProjects = projects.filter(project => project.IDClient === selectedClient);
            setProjectsPicker(filteredProjects);
        } else {
            setProjectsPicker([]);
        }
    }, [selectedClient, projects]);
    useEffect(() => {
        // if prestation is in betonPhases show section beton else hide it
        if (selectedPrestation && BetonPhases.includes(selectedPrestation)) {
            setBetonSectionVisibility(true);
        }
        else {
            setBetonSectionVisibility(false);
        }
    }, [selectedPrestation])

    const getData = () => {
        if (!clients || !projects || !prestations || !materiaux || !types_beton || !nature_echantillons) {
            const API_URL = `${BASE_URL}/?page=NewReceptionInterface`;
            fetchData(API_URL, TOKEN);
        }
    }

    const fetchData = async (url, token) => {
        setRefreshing(true);
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
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
                setClients(data.clients);
                setProjects(data.projects);
                setPrestations(data.phases);
                setMateriaux(data.materiaux);
                setTypes_beton(data.types_beton);
                setNatures_echantillon(data.natures_echantillon);
                setInterventions(data.interventions);
                dispatch(setReceptionData(data.clients, data.projects, data.phases, data.materiaux, data.types_beton, data.natures_echantillon, data.interventions));

            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setRefreshing(false);
        }
    };
    const insertReception = async (url, token) => {
        setRefreshing(true);
        // return;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                // intervention_id,IDPhase, IDProjet, nombre, IDType_beton, IDMateriaux, observation, date_prevus, prelevement_par, Compression, Traction, Lieux_ouvrage, Traction_fend
                body: JSON.stringify({
                    "intervention_id": selectedIntervention, "IDPhase": selectedPrestation, "IDProjet": selectedProject,
                    "nombre": nbr_echatillon, "IDType_beton": betonSelected, "IDMateriaux": selectedMatiere, "observation": obs,
                    "date_prevus": parseInt(moment(selectedDate, "DD/MM/YYYY").format("YYYYMMDD")), "prelevement_par": preleves.indexOf(preleve), "Compression": compression ? 1 : 0, "Traction": flexion ? 1 : 0,
                    "Lieux_ouvrage": lieu_prelevement, "Traction_fend": fendage ? 1 : 0
                })
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
                Alert.alert("Un problème est survenu lors de l'ajout de la réception");
                navigation.navigate("Déconnexion");
                console.log("Log Out");
                return;
            }
            if (data != null) {
                if (data) {
                    Alert.alert("Réception ajoutée avec succès");
                } else {
                    Alert.alert("Un problème est survenu lors de l'ajout de la réception");
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setRefreshing(false);
        }
    };


    const showClick = (section) => {
        if (showenSections.includes(section)) {
            setShowenSections(showenSections.filter((item) => item !== section));
        } else {
            setShowenSections([...showenSections, section]);
        }
    }
    const addNbrJr = () => {
        if (!nbr_jrs.includes(jrs) && jrs !== "") {
            setNbr_jrs([...nbr_jrs, jrs]);
            setJrs("");
        }
    }
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const showDatePicker2 = () => {
        setDatePickerVisibility2(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
        setDatePickerVisibility2(false);
    };

    const handleConfirm = (date) => {
        setSelectedDate(date);
        hideDatePicker();
    };
    const handleConfirm2 = (date) => {
        setSelectedDate2(date);
        hideDatePicker();
    };

    const handleAddIntervention = () => {
        // check intervention_id,IDPhase, IDProjet, nombre, IDType_beton, IDMateriaux, observation, date_prevus, prelevement_par, Compression, Traction, Lieux_ouvrage, Traction_fend
        if (!selectedIntervention || !selectedPrestation || !selectedProject || !selectedMatiere || !nbr_echatillon || !preleve || !lieu_prelevement || !obs) {
            Alert.alert('Veuillez remplir tous les champs');
            return;
        }
        ConfirmAction(
            "Êtes-vous sûr de vouloir ajouter cette réception?",
            () => {
                const API_URL = `${BASE_URL}/?page=NewReception`;
                insertReception(API_URL, TOKEN);
                dispatch(clearInterventionData());
                let intervention_id = selectedIntervention;
                setSelectedClient("");
                setSelectedProject("");
                setSelectedPrestation("");
                setSelectedMatiere("");
                setNbr_echatillon(2);
                setSelectedDate(null);
                setEtat_recuperation("Réccupéré");
                setPreleve("LGC");
                setEssaie("Labo");
                setBetonSelected("");
                setSlump("");
                setCompression(false);
                setfendage(false);
                setFlexion(false);
                setConfectionSelected("Vibration");
                setFabricationSelected("Manuel");
                setCentralSelected("");
                setBL("");
                setNbr_jrs([]);
                setJrs("");
                setLieu_prelevement("");
                setNature_echantillon("");
                setObs("");
                setSelectedIntervention('');
                Alert.alert('Réception ajoutée avec succès \nVeuillez charger le PV');
                navigation.navigate('PVs', { "id": intervention_id });
            });
    };

    return (
        <View >
            <View style={styles.modalView}>

                {/* refreshing */}
                {/* {refreshing ? <View style={styles.refreshing}><ActivityIndicator size="large" color="#4b6aff" /></View> : null} */}

                <ScrollView contentContainerStyle={styles.scrollViewContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />}
                >

                    <View style={styles.intervention}>
                        <Text style={styles.label}>N° Intervention</Text>
                        <Picker
                            selectedValue={selectedIntervention.toString()}
                            onValueChange={(itemValue, itemIndex) => setSelectedIntervention(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="N° Intervention " value="" />
                            {interventions ?
                                interventions.map((intervention, index) => (
                                    <Picker.Item key={index} label={intervention.intervention_id} value={intervention.intervention_id} />
                                )) : null}
                        </Picker>
                    </View>
                    <View style={styles.section_ttl}>
                        <Text style={styles.section_title}>Informations Projet</Text>
                        <View style={styles.show}>
                            <TouchableOpacity onPress={() => { showClick("client") }}>
                                {showenSections.includes('client') ? <AntDesign name="down" size={18} color="black" /> : <AntDesign name="right" size={18} color="black" />}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={showenSections.includes('client') ? styles.section : { display: "none" }}>
                        <Text style={styles.label}>Client</Text>
                        <Picker
                            selectedValue={selectedClient}
                            onValueChange={(itemValue, itemIndex) => setSelectedClient(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Séléctionner Client" value="" />
                            {clients ?
                                clients.map((client, index) => (
                                    <Picker.Item key={index} label={client.abr_client} value={client.IDClient} />
                                )) : null}
                        </Picker>
                        <Text style={styles.label}>Projet</Text>
                        <Picker
                            selectedValue={selectedProject}
                            onValueChange={(itemValue, itemIndex) => setSelectedProject(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Séléctionner Projet" value="" />
                            {projectsPicker ?
                                projectsPicker.map((project, index) => (
                                    <Picker.Item key={index} label={project.abr_projet} value={project.IDProjet} />
                                )) : null}
                        </Picker>
                    </View>


                    <View style={styles.section_ttl}>
                        <Text style={styles.section_title}>Informations Prestation</Text>
                        <View style={styles.show}>
                            <TouchableOpacity onPress={() => { showClick("Materiaux") }}>
                                {showenSections.includes('Materiaux') ? <AntDesign name="down" size={18} color="black" /> : <AntDesign name="right" size={18} color="black" />}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={showenSections.includes('Materiaux') ? styles.section : { display: "none" }}>
                        <Text style={styles.label}>Prestation</Text>
                        <Picker
                            selectedValue={selectedPrestation}
                            onValueChange={(itemValue, itemIndex) => setSelectedPrestation(itemValue)}

                            style={styles.picker}
                        >
                            <Picker.Item label="Séléctionner Prestation" value="" />
                            {prestations ?
                                prestations.map((prestation, index) => (
                                    <Picker.Item key={index} label={prestation.libelle} value={prestation.IDPhase} />
                                )) : null}
                        </Picker>
                        <View style={styles.twoColumns}>
                            <View>
                                <Text style={styles.label}>Matériaux</Text>
                                <Picker
                                    selectedValue={selectedMatiere}
                                    onValueChange={(itemValue, itemIndex) => setSelectedMatiere(itemValue)}
                                    style={styles.small_picker}
                                >
                                    <Picker.Item label="Séléctionner Matériaux" value="" />
                                    {materiaux ?
                                        materiaux.map((matiere, index) => (
                                            <Picker.Item key={index} label={matiere.Lib_materiaux} value={matiere.IDMateriaux} />
                                        )) : null}
                                </Picker>
                            </View>
                            <View>
                                <Text style={styles.label}>Nbr echantillon</Text>
                                <TextInput value={nbr_echatillon} onChangeText={setNbr_echatillon} keyboardType="numeric" style={styles.smallInput} />
                            </View>
                        </View>
                        <Text style={styles.label}>Nature Echantillon</Text>
                        <Picker
                            selectedValue={nature_echantillon}
                            onValueChange={(itemValue, itemIndex) => setNature_echantillon(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Séléctionner nature" value="" />
                            {nature_echantillons ?
                                nature_echantillons.map((nature, index) => (
                                    <Picker.Item key={index} label={nature.Nature_ech} value={nature.IDNature_echantillon} />
                                )) : null}
                        </Picker>
                        <Text style={styles.label}>Lieu Prélevement</Text>
                        <TextInput value={lieu_prelevement} onChangeText={setLieu_prelevement} style={styles.textInput2} />
                        <Text style={styles.label}>Observation</Text>
                        <TextInput value={obs} onChangeText={setObs} style={styles.textInput2} />
                    </View>

                    <View style={styles.section_ttl}>
                        <Text style={styles.section_title}>Informations Réception</Text>
                        <View style={styles.show}>
                            <TouchableOpacity onPress={() => { showClick("Details") }}>
                                {showenSections.includes('Details') ? <AntDesign name="down" size={18} color="black" /> : <AntDesign name="right" size={18} color="black" />}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={showenSections.includes('Details') ? styles.section : { display: "none" }}>
                        <View style={styles.grid}>
                            <View style={styles.col}>
                                <Text style={styles.label}>Date réception</Text>
                                <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
                                    <Text style={styles.dateButtonText}>
                                        {selectedDate ? moment(selectedDate).format('MM/DD/YYYY') : 'Séléctionner Date'}
                                    </Text>
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={handleConfirm}
                                    onCancel={hideDatePicker}
                                />
                            </View>
                            {isBetonSectionVisible ?
                                (<View style={styles.col}>
                                    <Text style={styles.label}>Date gaché béton</Text>
                                    <TouchableOpacity style={styles.dateButton} onPress={showDatePicker2}>
                                        <Text style={styles.dateButtonText}>
                                            {selectedDate2 ? moment(selectedDate2).format('MM/DD/YYYY') : 'Séléctionner Date'}
                                        </Text>
                                    </TouchableOpacity>
                                    <DateTimePickerModal
                                        isVisible={isDatePickerVisible2}
                                        mode="date"
                                        onConfirm={handleConfirm2}
                                        onCancel={hideDatePicker}
                                    />
                                </View>) : null}
                        </View>
                        <View style={styles.grid}>
                            <View style={styles.col}>
                                <Text style={styles.label}>Etat récupération</Text>
                                <Picker
                                    selectedValue={etat_recuperation}
                                    onValueChange={(itemValue, itemIndex) => setEtat_recuperation(itemValue)}
                                    style={{ width: 150, height: 50, marginBottom: 5 }}
                                >
                                    {etats_recuperation.map((etat, index) => (
                                        <Picker.Item key={index} label={etat} value={etat} />
                                    ))}
                                </Picker>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.label}>Prélévé par</Text>
                                <Picker
                                    selectedValue={preleve}
                                    onValueChange={(itemValue, itemIndex) => setPreleve(itemValue)}
                                    style={styles.small_picker}
                                >
                                    {preleves.map((pr, index) => (
                                        <Picker.Item key={index} label={pr} value={pr} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.grid}>
                            <View style={styles.col}>
                                <Text style={styles.label}>Type réception</Text>
                                <Picker
                                    selectedValue={reception_type}
                                    onValueChange={(itemValue, itemIndex) => setReception_type(itemValue)}
                                    style={{ width: 150, height: 50, marginBottom: 5 }}
                                >
                                    {receptions_types.map((type, index) => (
                                        <Picker.Item key={index} label={type} value={type} style={{ width: 140 }} />
                                    ))}
                                </Picker>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.label}>Essaie</Text>
                                <Picker
                                    selectedValue={Essaie}
                                    onValueChange={(itemValue, itemIndex) => setEssaie(itemValue)}
                                    style={{ width: 150, height: 50, marginBottom: 5 }}
                                >
                                    {essaies.map((essaie, index) => (
                                        <Picker.Item key={index} label={essaie} value={essaie} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                    </View>

                    {isBetonSectionVisible ?
                        (<><View style={styles.section_ttl}>
                            <Text style={styles.section_title}>Informations Béton</Text>
                            <View style={styles.show}>
                                <TouchableOpacity onPress={() => { showClick("Béton") }}>
                                    {showenSections.includes('Béton') ? <AntDesign name="down" size={18} color="black" /> : <AntDesign name="right" size={18} color="black" />}
                                </TouchableOpacity>
                            </View>
                        </View>
                            <View style={showenSections.includes('Béton') ? styles.section : { display: "none" }}>
                                <View style={styles.twoColumns}>
                                    <View>
                                        <Text style={styles.label}>Type Béton</Text>
                                        <Picker
                                            selectedValue={betonSelected}
                                            onValueChange={(itemValue, itemIndex) => setBetonSelected(itemValue)}
                                            style={styles.small_picker}
                                        >
                                            <Picker.Item label="Séléctionner béton" value="" />
                                            {types_beton ?
                                                types_beton.map((beton, index) => (
                                                    <Picker.Item key={index} label={beton.Lib_type_beton} value={beton.IDType_beton} />
                                                )) : null}
                                        </Picker>
                                    </View>
                                    <View>
                                        <Text style={styles.label}>Slump</Text>
                                        <TextInput value={slump} onChangeText={setSlump} keyboardType="numeric" style={styles.smallInput} />
                                    </View>
                                </View>

                                <View style={styles.grid}>
                                    <View style={[styles.col, styles.checkView]}>
                                        <Checkbox style={styles.checkbox} value={compression} onValueChange={setCompression} />
                                        <Text style={styles.labelChekbox}>Compression</Text>
                                    </View>
                                    <View style={[styles.col, styles.checkView]}>
                                        <Checkbox style={styles.checkbox} value={fendage} onValueChange={setfendage} />
                                        <Text style={styles.labelChekbox}>fendage</Text>
                                    </View>
                                </View>
                                <View style={styles.grid}>
                                    <View style={[styles.col, styles.checkView]}>
                                        <Checkbox style={styles.checkbox} value={flexion} onValueChange={setFlexion} />
                                        <Text style={styles.labelChekbox}>Flexion</Text>
                                    </View>
                                </View>
                                <View style={styles.grid}>
                                    <View style={styles.col}>
                                        <Text style={styles.label}>Mode Confection</Text>
                                        <Picker
                                            selectedValue={confectionSelected}
                                            onValueChange={(itemValue, itemIndex) => setConfectionSelected(itemValue)}
                                            style={{ width: 150, height: 50, marginBottom: 5 }}
                                        >
                                            {modes_confection.map((mode, index) => (
                                                <Picker.Item key={index} label={mode} value={mode} />
                                            ))}
                                        </Picker>
                                    </View>
                                    <View style={styles.col}>
                                        <Text style={styles.label}>Mode Fabrication</Text>
                                        <Picker
                                            selectedValue={fabricationSelected}
                                            onValueChange={(itemValue, itemIndex) => setFabricationSelected(itemValue)}
                                            style={styles.small_picker}
                                        >
                                            {modes_fabrication.map((mode, index) => (
                                                <Picker.Item key={index} label={mode} value={mode} />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>
                                {fabricationSelected === "central" ?
                                    (<View style={styles.grid}>
                                        <View style={styles.col}>
                                            <Text style={styles.label}>Central</Text>
                                            <TextInput value={centralSelected} onChangeText={setCentralSelected} style={styles.textInput2} />
                                        </View>
                                        <View style={styles.col}>
                                            <Text style={styles.label}>BL</Text>
                                            <TextInput value={BL} onChangeText={setBL} style={styles.textInput2} />
                                        </View>
                                    </View>) : <></>}
                                <View style={styles.grid}>
                                    <View style={styles.col}>
                                        <Text style={styles.label}>Cylindre</Text>
                                        <Picker
                                            selectedValue={selectedCylindre}
                                            onValueChange={(itemValue, itemIndex) => setSelectedCylindre(itemValue)}
                                            style={styles.small_picker}
                                        >
                                            {cylindres.map((cylindre, index) => (
                                                <Picker.Item key={index} label={cylindre} value={cylindre} />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>
                                <View style={[styles.grid, { alignItems: "flex-start" }]}>
                                    <View style={styles.col}>
                                        <Text style={styles.label}>Ajouter</Text>
                                        <View style={{ flexDirection: "row" }}>
                                            <TextInput value={jrs} onChangeText={setJrs} style={styles.textInput3} />
                                            <TouchableOpacity style={styles.addButton} onPress={addNbrJr}>
                                                <Text style={styles.addButtonText}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={styles.col}>
                                        <Text style={styles.label}>Nbr jours</Text>
                                        <Text style={styles.tableRow}>
                                            {nbr_jrs.join(', ')}
                                        </Text>
                                    </View>
                                </View>

                            </View></>
                        ) : <></>}
                </ScrollView>
                <View style={{ position: "absolute", bottom: 0, width: "100%", left: 10 }}>
                    <TouchableOpacity style={styles.modalButton} onPress={handleAddIntervention}>
                        <Text style={styles.modalButtonText}>Ajouter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    modalView: {
        position: "relative",
        width: '100%',
        height: "100%",
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        paddingBottom: 40,
    },
    scrollViewContent: {
        width: '100%',
        padding: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: "center"
    },
    label: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5
        // marginBottom: 3,
    },
    picker: {
        width: '100%',
        height: 50,
        marginBottom: 5,
    },
    small_picker: {
        width: 220,
        height: 50,
        marginBottom: 5,
    },
    textInput: {
        width: '100%',
        height: 50,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    smallInput: {
        width: 40,
        height: 30,
        marginBottom: 20,
        marginTop: 10,
        paddingHorizontal: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    dateButton: {
        width: '100%',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginBottom: 20,
    },
    dateButtonText: {
        fontSize: 15,
        color: '#333',
    },
    modalButton: {
        backgroundColor: '#4bacc0',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    section_title: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 5
    },
    section_ttl: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        position: "relative",
    },
    show: {
        position: "absolute",
        right: 15,
        top: 5,
    },
    twoColumns: {
        flexDirection: 'row',
        alignItems: "center",
    },
    grid: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        alignItems: "center",
        marginBottom: 5,
    },
    col: { width: "48%" },
    checkView: {
        // backgroundColor: "#f0f0f0",
        flexDirection: 'row',
        alignItems: "center",
        padding: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        marginRight: 10
    },
    labelChekbox: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5
    },
    textInput2: {
        width: '100%',
        height: 30,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    textInput3: {
        width: '70%',
        height: 30,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    addButton: {
        backgroundColor: "#4bacc0",
        height: 30,
        paddingHorizontal: 10,
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    addButtonText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
    },
    tableCell: {
        fontSize: 16,
        textAlign: 'center',
        width: '100%',
    },
    refreshing: {
        position: "absolute",
        top: "50%",
        left: "50%",
        zIndex: 111
    },
});
