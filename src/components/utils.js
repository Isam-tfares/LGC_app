import React from 'react';
import { Alert } from "react-native";

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