import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, Text, Image, KeyboardAvoidingView, ScrollView, Platform, SafeAreaView } from 'react-native';

const Login = ({ isLogined, setLogined, setToken }) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorUsername, setErrorUsername] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const handleLogin = async () => {
        if (username === '') {
            setErrorUsername('Veuillez entrer une adresse Username valide.');
            return;
        }

        if (password.length < 3) {
            setErrorPassword('Le mot de passe doit contenir au moins 3 caractères.');
            return;
        }

        const API_URL = 'http://10.0.2.2/HFSQL_PHP/login.php';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                    username,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            // console.log(JSON.stringify(data))
            if (data.message === 'Login successful.') {
                const token = data.jwt;
                setToken(token);
                const user = data.user;
                // console.log(JSON.stringify(user)) // to save this data
                const userType = user?.user_type; // Access the userType property if present

                if (userType === 'technicien') {
                    setLogined(1);
                } else if (userType === 'chef') {
                    setLogined(2);
                } else if (userType === 'receptionneur') {
                    setLogined(3);
                } else if (userType === 'essayeur') {
                    setLogined(4);
                } else {
                    Alert.alert('Accès non autorisé'); // Alert if userType doesn't match expected roles
                }
            } else {
                Alert.alert(data.message);
            }
        } catch (error) {
            console.error(error); // Log the error for debugging
            Alert.alert('Erreur de connexion');
        } finally {
            setErrorUsername(''); // Clear error messages after the request completes
            setErrorPassword('');
        }
    };

    const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0; // Adjust as needed

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
                    <TextInput
                        placeholder="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                        placeholderTextColor="#edede9"
                    />
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