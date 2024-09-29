import React from 'react';
import { Alert } from "react-native";
import * as FileSystem from 'expo-file-system';

const directoryPath = `${FileSystem.documentDirectory}LGC/`;
const filePath = `${directoryPath}api.txt`;

export const readApiFromFile = async () => {
    try {
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (fileInfo.exists) {
            // Read the content of the file
            const apiIP = await FileSystem.readAsStringAsync(filePath);
            return apiIP;
        } else {
            console.log('File does not exist.');
            return null;
        }
    } catch (error) {
        console.log('Error reading file:', error);
        return null;
    }
};

const ensureDirectoryExists = async (directory) => {
    const dirInfo = await FileSystem.getInfoAsync(directory);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    }
};

export const IsAPIExist = async () => {
    try {
        // Ensure the directory exists
        await ensureDirectoryExists(directoryPath);
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (fileInfo.exists) {
            // If file exists, read its content
            const ip = await FileSystem.readAsStringAsync(filePath);
            if (ip) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.log('Error checking file:', error);
        return false;
    }
};

// New function to set the BASE_URL asynchronously
let apiIP = null;

export const initializeAPI = async () => {
    apiIP = await readApiFromFile();
};

// Use this function to retrieve BASE_URL and BASE_PVS_URL after initializing
export const getBaseUrl = () => {
    if (apiIP) {
        return `http://${apiIP}/LGC_backend`;
    }
    return null;
};

export const getBasePvsUrl = () => {
    if (apiIP) {
        return `http://${apiIP}/LGC_backend/pvs/`;
    }
    return null;
};

// Confirm action utility
export const ConfirmAction = (message, onConfirm) => {
    Alert.alert(
        'Confirmation',
        message,
        [
            {
                text: 'Non',
                onPress: () => console.log('Action annulée'),
                style: 'cancel',
            },
            {
                text: 'Oui',
                onPress: onConfirm,
            },
        ],
        { cancelable: false }
    );
};
