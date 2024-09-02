// src/screens/Login.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, Text, Image, KeyboardAvoidingView, ScrollView, Platform, SafeAreaView, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';
import { setUser } from '../actions/userActions'; // Update path as needed
import { BASE_URL } from '../components/utils';

const Login = ({ isLogined, setLogined }) => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorUsername, setErrorUsername] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [isVisible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const user = useSelector(state => state.user);
    useEffect(() => {
        if (user.user) {
            switch (user.user.user_type) {
                case 'technicien':
                    setLogined(1);
                    break;
                case 'chef':
                    setLogined(2);
                    break;
                case 'receptionneur':
                    setLogined(3);
                    break;
                case 'essayeur':
                    setLogined(4);
                    break;
                default:
                    Alert.alert('Accès non autorisé');
            }
        }
    }, [user, setLogined]);

    const handleLogin = async () => {
        if (username === '') {
            setErrorUsername('Veuillez entrer un Username valide.');
            return;
        }

        if (password.length < 3) {
            setErrorPassword('Le mot de passe doit contenir au moins 3 caractères.');
            return;
        }

        const API_URL = `${BASE_URL}/?page=login`;
        setLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                if (data.error == "Invalid username or password.") {
                    Alert.alert("Nom d'utilisateur ou mot de passe incorrect");
                }
                return;
            }

            const data = await response.json();

            if (data.message === 'Login successful.') {
                const token = data.jwt;
                const user = data.user;
                dispatch(setUser(user, token));
            } else {
                Alert.alert(data.message);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erreur de connexion');
        } finally {
            setErrorUsername('');
            setErrorPassword('');
            setLoading(false); // Ensure loading state is turned off after fetch

        }
    };

    const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={keyboardVerticalOffset}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.imgC}>
                        <Image style={styles.img} source={require('../../assets/login.jpg')} />
                    </View>
                    <View style={{ marginBottom: 30, marginTop: 10 }}>
                        <Text style={{ color: 'white', fontSize: 24 }}>Login</Text>
                    </View>
                    {loading ?
                        (<ActivityIndicator color={"white"} />)
                        : (<></>)}
                    <TextInput
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChangeText={setUsername}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                        placeholderTextColor="#edede9"
                    />
                    <View style={styles.errorC}>
                        <Text style={styles.error}>{errorUsername}</Text>
                    </View>
                    <View style={{ position: "relative" }}>

                        {isVisible ?
                            (<TextInput
                                placeholder="Mot de passe"
                                value={password}
                                onChangeText={setPassword}
                                style={styles.input}
                                placeholderTextColor="#edede9" />)
                            :
                            (<TextInput
                                placeholder="Mot de passe"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                style={styles.input}
                                placeholderTextColor="#edede9" />)
                        }

                        <TouchableOpacity style={styles.eyeView} onPress={() => { setVisible(!isVisible) }}>
                            <Ionicons name={isVisible ? "eye-off" : "eye"} size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.errorC}>
                        <Text style={styles.error}>{errorPassword}</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.password}>Mot de passe oubliée ?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogin} style={styles.button}>
                        <Text style={styles.btnText}>Se connecter</Text>
                    </TouchableOpacity>
                </ScrollView>
                <View style={styles.footer}>
                    <Image style={styles.img2} source={require('../../assets/logo.png')} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#1c488c',
    },
    container: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: 300,
        margin: 10,
        padding: 10,
        borderBottomColor: 'white',
        borderBottomWidth: 2,
        color: 'white',
        // position: "relative"
    },
    eyeView: {
        position: "absolute",
        top: "40%",
        right: "5%",
        zIndex: 100
    },
    btnText: {
        color: '#1c488c',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
    },
    password: {
        fontSize: 10,
        color: 'white',
        margin: 5,
    },
    img: {
        backgroundColor: 'white',
        borderRadius: 50,
        width: 60,
        height: 60,
        padding: 10,
    },
    img2: {
        backgroundColor: 'white',
        width: 182,
        height: 50,
        padding: 10,
    },
    imgC: {
        width: 70,
        height: 70,
        borderRadius: 200,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        backgroundColor: 'white',
        height: 80,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: "absolute",
        bottom: 0,
    },
    errorC: {
        textAlign: 'left',
        paddingRight: 190,
        position: 'relative',
        height: 20,
        marginBottom: 10,
    },
    error: {
        position: 'absolute',
        color: '#f94144',
        left: -50,
    },
    button: {
        marginVertical: 10,
        width: 300,
        backgroundColor: 'white',
        padding: 10,
    }
});

export default Login;
