import React, { useEffect } from 'react';
import { View, Text } from 'react-native';


export default function Deconnexion({ navigation, setLogined }) {
    useEffect(() => {
        setLogined(false);
    }, []);
    return (
        <View>
            <Text>Déconnexion ...</Text>
        </View>
    )
}
