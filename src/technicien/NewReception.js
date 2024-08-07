import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Checkbox from 'expo-checkbox';


export default function NewReception({ route, navigation }) {
    let intervention_id = route.params ? Number.parseInt(route.params.id) : "";
    console.log('Intervention ID:', intervention_id);
    const [interventions, setInterventions] = useState([
        { id: 1, client: 'Client 1', projet: 'Projet 1', object: "Objet 1", adresse: 'Adresse 1', technicien: "Techinicien 1", date: "04/08/2024", materiaux: "béton", prestation: 'Prestation 1', status: "faite", reception: "faite" },
        { id: 2, client: 'Client 2', projet: 'Projet 2', object: "Objet 2", adresse: 'Adresse 2', technicien: "Techinicien 1", date: "04/08/2024", materiaux: "béton", prestation: 'Prestation 2', status: "faite", reception: "Non faite" },
        { id: 3, client: 'Client 3', projet: 'Projet 3', object: "Objet 3", adresse: 'Adresse 3', technicien: "Techinicien 1", date: "04/08/2024", materiaux: "béton", prestation: 'Prestation 3', status: "annulée", obs: "commentaire sur annulation d\'intervention" },
        { id: 4, client: 'Client 4', projet: 'Projet 4', object: "Objet 4", adresse: 'Adresse 4', technicien: "Techinicien 1", date: "05/08/2024", materiaux: "béton", prestation: 'Prestation 4', status: "faite", reception: "faite" },
        { id: 5, client: 'Client 5', projet: 'Projet 5', object: "Objet 5", adresse: 'Adresse 5', technicien: "Techinicien 1", date: "05/08/2024", materiaux: "béton", prestation: 'Prestation 5', status: "En cours" },
        { id: 6, client: 'Client 6', projet: 'Projet 6', object: "Objet 6", adresse: 'Adresse 6', technicien: "Techinicien 1", date: "05/08/2024", materiaux: "béton", prestation: 'Prestation 6', status: "En cours" },
    ]);
    const [selectedIntervention, setSelectedIntervention] = useState(intervention_id);
    const [intervention, setInterevntion] = useState(selectedIntervention ? interventions.find(item => item.id === selectedIntervention) : null);
    const interventions_ids = [1, 2, 3, 4, 5, 6];
    const clients = ["Client 1", "Client 2", "Client 3", "Client 4", "Client 5", "Client 6"];
    const projects = ["Projet 6", "Projet 1", "Projet 2", "Projet 3", "Projet 4", "Projet 5", "Projet 6"];
    const prestations = ["Prestation 1", "Prestation 2", "Prestation 3", "Prestation 4", "Prestation 5", "Prestation 6", "Prestation 7", "Prestation 8", "Prestation 9", "Prestation 10"];
    const materiaux = ["matiere 1", "matiere 2", "matiere 3", "matiere 4", "béton"];
    const techniciens = ["technicien 1", "technicien 2", "technicien 3", "technicien 4", "technicien 5"];
    const etats_recuperation = ["Réccupéré", "Non réccupéré"];
    const preleves = ["LGC", "Client"];
    const receptions_types = ["interne", "externe"];
    const essaies = ["Labo", "Chantier"];
    const types_beton = ["Béton", "Mortier", "Granulat", "Ciment", "Eau", "Adjuvant", "Fibre", "Autre"];
    const modes_confection = ["mode 1", "mode 2"];
    const modes_fabrication = ["mode 1", "mode 2"];
    const nature_echantillons = ["Béton", "Mortier", "Granulat", "Ciment", "Eau", "Adjuvant", "Fibre", "Autre"];

    const [showenSections, setShowenSections] = useState(["client", "Materiaux", "Béton", "Details"]);
    const [selectedClient, setSelectedClient] = useState(intervention ? intervention.client : "");
    const [selectedProject, setSelectedProject] = useState(intervention ? intervention.projet : "");
    const [selectedTechnician, setSelectedTechnician] = useState(intervention ? intervention.technicien : "");
    const [selectedPrestation, setSelectedPrestation] = useState(intervention ? intervention.prestation : "");
    const [selectedMatiere, setSelectedMatiere] = useState(intervention ? intervention.materiaux : "");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDate2, setSelectedDate2] = useState(null);
    const [nbr_echatillon, setNbr_echatillon] = useState(2);
    const [etat_recuperation, setEtat_recuperation] = useState('Réccupéré');
    const [preleve, setPreleve] = useState('LGC');
    const [Essaie, setEssaie] = useState("Labo");
    const [reception_type, setReception_type] = useState("interne");
    const [betonSelected, setBetonSelected] = useState("");
    const [slump, setSlump] = useState("");
    const [compression, setCompression] = useState(false);
    const [pendage, setPendage] = useState(false);
    const [flexion, setFlexion] = useState(false);
    const [confectionSelected, setConfectionSelected] = useState("mode 1");
    const [fabricationSelected, setFabricationSelected] = useState("mode 1");
    const [centralSelected, setCentralSelected] = useState("");
    const [BL, setBL] = useState("");
    const [nbr_jrs, setNbr_jrs] = useState([]);
    const [jrs, setJrs] = useState("");
    const [lieu_prelevement, setLieu_prelevement] = useState(intervention ? intervention.adresse : "");
    const [nature_echantillon, setNature_echantillon] = useState("");
    const [obs, setObs] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    useEffect(() => {
        const selected = interventions.find(item => item.id === selectedIntervention);
        setInterevntion(selected || null);
        if (selected) {
            setSelectedClient(selected.client);
            setSelectedProject(selected.projet);
            setSelectedTechnician(selected.technicien);
            setSelectedPrestation(selected.prestation);
            setLieu_prelevement(selected.adresse);
            setSelectedMatiere(selected.materiaux);
        }
    }, [selectedIntervention]);
    useEffect(() => {
        if (Number.isInteger(intervention_id)) {
            setSelectedIntervention(intervention_id);
        }
    }, [intervention_id]);
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

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
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
        // Check for empty fields
        // if (!selectedClient || !selectedProject || !selectedPrestation || !selectedMatiere || !nbr_echatillon || !selectedDate || !selectedTechnician || !etat_recuperation || !preleve || !Essaie || !betonSelected || !slump || !centralSelected || !BL || nbr_jrs.length === 0) {
        //     Alert.alert('Veuillez remplir tous les champs obligatoires');
        //     return;
        // }

        // All fields are filled, proceed with adding the intervention
        console.log('New Reception Data:', {
            selectedClient,
            selectedProject,
            selectedPrestation,
            selectedMatiere,
            nbr_echatillon,
            selectedDate,
            selectedTechnician,
            etat_recuperation,
            preleve,
            Essaie,
            betonSelected,
            slump,
            centralSelected,
            BL,
            nbr_jrs,
        });
        intervention_id = selectedIntervention;
        setSelectedClient("");
        setSelectedProject("");
        setSelectedPrestation("");
        setSelectedMatiere("");
        setNbr_echatillon(2);
        setSelectedDate(null);
        setSelectedTechnician("");
        setEtat_recuperation("Réccupéré");
        setPreleve("LGC");
        setEssaie("Labo");
        setBetonSelected("");
        setSlump("");
        setCompression(false);
        setPendage(false);
        setFlexion(false);
        setConfectionSelected("mode 1");
        setFabricationSelected("mode 1");
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
    };

    return (
        <View >
            <View style={styles.modalView}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.intervention}>
                        <Text style={styles.label}>N° Intervention</Text>
                        <Picker
                            selectedValue={selectedIntervention}
                            onValueChange={(itemValue, itemIndex) => setSelectedIntervention(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="N° Intervention " value="" />
                            {interventions_ids.map((intervention, index) => (
                                <Picker.Item key={index} label={intervention} value={intervention} />
                            ))}
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
                            {clients.map((client, index) => (
                                <Picker.Item key={index} label={client} value={client} />
                            ))}
                        </Picker>
                        <Text style={styles.label}>Projet</Text>
                        <Picker
                            selectedValue={selectedProject}
                            onValueChange={(itemValue, itemIndex) => setSelectedProject(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Séléctionner Projet" value="" />
                            {projects.map((project, index) => (
                                <Picker.Item key={index} label={project} value={project} />
                            ))}
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
                            {prestations.map((prestation, index) => (
                                <Picker.Item key={index} label={prestation} value={prestation} />
                            ))}
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
                                    {materiaux.map((matiere, index) => (
                                        <Picker.Item key={index} label={matiere} value={matiere} />
                                    ))}
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
                            {nature_echantillons.map((nature, index) => (
                                <Picker.Item key={index} label={nature} value={nature} />
                            ))}
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
                            <View style={styles.col}>
                                <Text style={styles.label}>Date confection béton</Text>
                                <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
                                    <Text style={styles.dateButtonText}>
                                        {selectedDate2 ? moment(selectedDate2).format('MM/DD/YYYY') : 'Séléctionner Date'}
                                    </Text>
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={handleConfirm2}
                                    onCancel={hideDatePicker}
                                />
                            </View>
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
                        <Text style={styles.label}>Technicien</Text>
                        <Picker
                            selectedValue={selectedTechnician}
                            onValueChange={(itemValue, itemIndex) => setSelectedTechnician(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Séléctionner Technicien" value="" />
                            {techniciens.map((technician, index) => (
                                <Picker.Item key={index} label={technician} value={technician} />
                            ))}
                        </Picker>
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


                    <View style={styles.section_ttl}>
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
                                    {types_beton.map((beton, index) => (
                                        <Picker.Item key={index} label={beton} value={beton} />
                                    ))}
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
                                <Checkbox style={styles.checkbox} value={pendage} onValueChange={setPendage} />
                                <Text style={styles.labelChekbox}>Pendage</Text>
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

                        <View style={styles.grid}>
                            <View style={styles.col}>
                                <Text style={styles.label}>Central</Text>
                                <TextInput value={centralSelected} onChangeText={setCentralSelected} style={styles.textInput2} />
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.label}>LB</Text>
                                <TextInput value={BL} onChangeText={setBL} style={styles.textInput2} />
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

                    </View>
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
});
