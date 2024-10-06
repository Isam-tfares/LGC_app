import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';

export default function EnterAPI({ setApiExists }) {
    const [apiIP, setApiIP] = useState(null);
    const [inputIP, setInputIP] = useState('');
    const directoryPath = `${FileSystem.documentDirectory}LGC/`;
    const filePath = `${directoryPath}api.txt`;

    useEffect(() => {
        // Check if the file exists when the app loads
        const checkApiFile = async () => {
            try {
                // Ensure the directory exists
                await ensureDirectoryExists(directoryPath);

                console.log('File is saved at:', filePath); // Log the file path

                const fileInfo = await FileSystem.getInfoAsync(filePath);
                if (fileInfo.exists) {
                    // If file exists, read its content
                    const ip = await FileSystem.readAsStringAsync(filePath);
                    if (ip) {
                        setApiIP(ip); // Set the IP address if found
                    } else {
                        requestApiInput(); // Ask user to input if file is empty
                    }
                } else {
                    requestApiInput(); // Ask user to input if file doesn't exist
                }
            } catch (error) {
                console.log('Error checking file:', error);
            }
        };

        checkApiFile();
    }, []);


    const ensureDirectoryExists = async (directory) => {
        const dirInfo = await FileSystem.getInfoAsync(directory);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
        }
    };

    const requestApiInput = () => {
        Alert.alert(
            "Entrez l'adresse IP de l'API ",
            "Aucune adresse IP trouvée. Veuillez saisir l'adresse IP de l'API principale. ",
            [{ text: 'OK' }]
        );
    };

    const saveApiIP = async () => {
        try {
            // Write the input IP address to the file
            await FileSystem.writeAsStringAsync(filePath, inputIP);
            setApiIP(inputIP); // Update the state with the new IP address
            setApiExists(true);
            Alert.alert('Succès', "L'adresse IP de l'API a été enregistrée.");
        } catch (error) {
            console.log("Erreur lors de l'écriture dans le fichier :", error);
            Alert.alert('Error', "Échec de l'enregistrement de l'adresse IP.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Entrez l'adresse IP de l'API"
                    value={inputIP}
                    onChangeText={setInputIP}
                />
                <Button title="Enregistrer l'IP de l'API" onPress={saveApiIP} />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    inputContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
        alignSelf: 'center',
    },
    input: {
        width: '100%',
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
    },
});
