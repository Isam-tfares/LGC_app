import React, { useEffect } from 'react';
import { View, Text } from 'react-native';


export default function Deconnexion({ navigation, setLogined, setToken }) {
    useEffect(() => {
        setLogined(false);
        setToken("");
    }, []);
    return (
        <View>
            <Text>Déconnexion ...</Text>
        </View>
    )
}
