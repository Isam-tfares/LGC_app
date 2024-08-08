import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

export default function PreReceptionDetails({ route, navigation }) {
    let { reception } = route.params;
    if (route.params.id) {
        console.log("fetch Prereception of intervention_id", route.params.id);
        reception = {
            n_reception: '4848',
            n_intervention: 1,
            id: '1',
            project: 'Project A',
            client: 'Client X',
            technicien: 'Technician 1',
            prestation: 'Prestation 1',
            materiaux: 'Material 1',
            date_reception: '2024-07-25',
            nbr_echantillon: '10',
            etat_recuperation: 'Récupérée',
            preleve: 'LGC',
            essaie: 'interne',
            beton: 'Béton 1',
            slump: '10 cm',
            central: 'Plant A',
            BL: '12345',
            nbr_jrs: '7,28',
        };
    }
    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.title}>N° réception</Text>
                        <Text style={styles.text}>{reception.n_reception}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Client</Text>
                        <Text style={styles.text}>{reception.client}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Projet</Text>
                        <Text style={styles.text}>{reception.project}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Technicien</Text>
                        <Text style={styles.text}>{reception.technicien}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Prestation</Text>
                        <Text style={styles.text}>{reception.prestation}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Material</Text>
                        <Text style={styles.text}>{reception.materiaux}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Date réception</Text>
                        <Text style={styles.text}>{reception.date_reception}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Nombre echantillon</Text>
                        <Text style={styles.text}>{reception.nbr_echantillon}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Etat de récupération </Text>
                        <Text style={styles.text}>{reception.etat_recuperation}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Prélevé par</Text>
                        <Text style={styles.text}>{reception.preleve}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Type Essaie</Text>
                        <Text style={styles.text}>{reception.essaie}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Type Béton</Text>
                        <Text style={styles.text}>{reception.beton}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Slump</Text>
                        <Text style={styles.text}>{reception.slump}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Central</Text>
                        <Text style={styles.text}>{reception.central}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>BL</Text>
                        <Text style={styles.text}>{reception.BL}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.title}>Nombre des jours</Text>
                        <Text style={styles.text}>{reception.nbr_jrs}</Text>
                    </View>
                    <View>
                        <Button color="blue" onPress={() => Alert.alert('Valider Prereception')} title="Valider Prereception" />
                    </View>
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
    },
});
