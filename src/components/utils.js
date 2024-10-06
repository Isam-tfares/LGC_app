import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
const directoryPath = `${FileSystem.documentDirectory}LGC/`;
const filePath = `${directoryPath}api.txt`;

// Ensure that the directory exists before accessing or creating files
const ensureDirectoryExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(directoryPath);
    if (!dirInfo.exists) {
        // Create the directory if it doesn't exist
        await FileSystem.makeDirectoryAsync(directoryPath, { intermediates: true });
        console.log('Directory created:', directoryPath);
    }
};

// Ensure the file exists and create it with default content if missing
const ensureApiFileExists = async () => {
    await ensureDirectoryExists(); // Ensure the directory exists

    const fileInfo = await FileSystem.getInfoAsync(filePath);

    if (!fileInfo.exists) {
        // File does not exist
        console.log('File does not exist.');
        return false;  // Return false as the file does not exist
    }

    // If file exists, read its content
    const fileContent = await FileSystem.readAsStringAsync(filePath);

    // Check if the file is empty or contains only whitespace
    if (!fileContent || fileContent.trim() === '') {
        console.log('API file is empty.');
        return false;  // Return false as the file exists but is empty
    }

    // If the file contains valid content, return true
    console.log('API file exists and contains valid content.');
    return true;
};


// Check if the API file exists
export const IsAPIExist = async () => {
    try {
        const fileExists = await ensureApiFileExists();  // Ensure file exists
        return fileExists;
    } catch (error) {
        console.log('Error checking file:', error);
        return false;
    }
};

// Function to read the API from the file
export const readApiFromFile = async () => {
    try {
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (fileInfo.exists) {
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

// Function to initialize the API by reading the file
let apiIP = null;

export const initializeAPI = async () => {
    apiIP = await readApiFromFile();
};

// Function to get the base URL using the IP from the file
export const getBaseUrl = () => {
    if (apiIP) {
        return `${apiIP}`;
    }
    return null;
};

// Function to get the PVS URL
export const getBasePvsUrl = () => {
    if (apiIP) {
        return `${apiIP}/pvs/`;
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