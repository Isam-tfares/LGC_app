import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PVReceptions({ navigation }) {

    return (
        <View style={styles.container}>
            <Text>Here exist list of PVs</Text>
        </View>
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
});
