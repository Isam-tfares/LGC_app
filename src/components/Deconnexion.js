import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../actions/userActions'; // Adjust the path as needed

export default function Deconnexion({ navigation, setLogined }) {
    const dispatch = useDispatch();

    useEffect(() => {
        setLogined(false);
        dispatch(logout());
    }, []);

    return (
        <View>
            <Text>Déconnexion ...</Text>
        </View>
    );
}
