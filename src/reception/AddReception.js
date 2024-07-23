import React, { useState } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet, Alert, TextInput, ScrollView, FlatList } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Checkbox from 'expo-checkbox';


export default function AddReception({ modalVisible, setModalVisible }) {
    const clients = ["client 1", "client 2", "client 3", "client 4", "client 5"];
    const projects = ["project 10", "project 11", "project 12", "project 13", "project 14", "project 15"];
    const prestations = ["prestation 1", "prestation 2", "prestation 3", "prestation 4", "prestation 5", "prestation 6", "prestation 7", "prestation 8", "prestation 9", "prestation 10"];
    const materiaux = ["matiere 1", "matiere 2", "matiere 3", "matiere 4", "matiere 5"];
    const techniciens = ["technicien 1", "technicien 2", "technicien 3", "technicien 4", "technicien 5"];
    const etats_recuperation = ["Réccupéré", "Non réccupéré"];
    const preleves = ["LGC", "Client"];
    const receptions_types = ["interne", "externe"];
    const essaies = ["Labo", "Chantier"];
    const types_beton = ["Béton", "Mortier", "Granulat", "Ciment", "Eau", "Adjuvant", "Fibre", "Autre"];
    const modes_confection = ["mode 1", "mode 2"];
    const modes_fabrication = ["mode 1", "mode 2"];
    const nature_echantillons = ["Béton", "Mortier", "Granulat", "Ciment", "Eau", "Adjuvant", "Fibre", "Autre"];

    const [showenSections, setShowenSections] = useState([]);

    const [selectedClient, setSelectedClient] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedTechnician, setSelectedTechnician] = useState('');
    const [selectedPrestation, setSelectedPrestation] = useState('');
    const [selectedMatiere, setSelectedMatiere] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
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
    const [lieu_prelevement, setLieu_prelevement] = useState("");
    const [nature_echantillon, setNature_echantillon] = useState("");
    const [obs, setObs] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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

    const handleAddIntervention = () => {
        Alert.alert('Réception ajoutée avec succès');
        setModalVisible(false);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalView}>

                    <TouchableOpacity style={styles.close}
                        onPress={() => setModalVisible(false)}
                    >
                        <Ionicons name="close-circle-sharp" size={40} color="red" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Nouvelle Réception</Text>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    close: {
        position: "absolute",
        top: -14,
        right: -14,
        zIndex: 1,
    },
    modalView: {
        position: "relative",
        width: '90%',
        height: "90%",
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
