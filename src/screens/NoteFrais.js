import * as React from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function NoteFrais({ navigation }) {

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View>
                <Text>Here exist Note Frais</Text>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    pgm: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    intervention: {
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#000'
    }
});