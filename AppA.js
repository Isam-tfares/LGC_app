import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';

export default function App() {
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
            'Enter API IP Address',
            'No IP address found. Please enter the backend API IP.',
            [{ text: 'OK' }]
        );
    };

    const saveApiIP = async () => {
        try {
            // Write the input IP address to the file
            await FileSystem.writeAsStringAsync(filePath, inputIP);
            setApiIP(inputIP); // Update the state with the new IP address
            Alert.alert('Success', 'API IP address has been saved.');
        } catch (error) {
            console.log('Error writing to file:', error);
            Alert.alert('Error', 'Failed to save IP address.');
        }
    };

    return (
        <View style={styles.container}>
            {apiIP ? (
                <Text>Using API: {apiIP}</Text>
            ) : (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter API IP Address"
                        value={inputIP}
                        onChangeText={setInputIP}
                    />
                    <Button title="Save API IP" onPress={saveApiIP} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%',
        alignItems: 'center',
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
