import React from 'react';
import { Alert } from "react-native";

export const BASE_URL = "http://192.168.43.88/LGC_backend";
export const BASE_PVS_URL = "http://192.168.43.88/LGC_backend/pvs/";

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