// C:\Users\bshoe\OneDrive\Desktop\game_theory\cooking\RecipeGenerator\app\(tabs)\LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { styles } from './styles.ts';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.API_URL || 'http://127.0.0.1:5000';

export const LoginScreen: React.FC<{ onLogin: (user: any) => void; onSwitchToHome: () => void }> = ({ onLogin, onSwitchToHome }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!username || !password) {
            Alert.alert("Error", "Please enter both username and password.");
            return;
        }

        console.log("Button clicked"); // Confirm button triggers
        setIsLoading(true);
        try {
            const endpoint = isRegistering ? '/register' : '/login';
            console.log(`Attempting ${isRegistering ? 'register' : 'login'} to ${API_URL}${endpoint} with:`, { username, password });
            console.log("Fetch starting");
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });
            console.log(`Response status for ${endpoint}:`, response.status);
            const data = await response.json();
            console.log(`Response data for ${endpoint}:`, data);

            if (response.ok) {
                if (isRegistering) {
                    Alert.alert("Success", "User registered successfully! Please log in.");
                    setIsRegistering(false);
                } else {
                    onLogin(data.user);
                }
            } else {
                Alert.alert("Error", data.error || "An error occurred.");
            }
        } catch (error) {
            console.error(`Error during ${isRegistering ? 'register' : 'login'}:`, error.message);
            console.error("Error details:", error);
            Alert.alert("Error", "Failed to connect to the server: " + error.message);
        } finally {
            console.log("Fetch completed");
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{isRegistering ? "Register" : "Login"} to Recipe Generator 🍳✨</Text>
            <View style={styles.inputSection}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter your username"
                    placeholderTextColor="#A0A0A0"
                />
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#A0A0A0"
                    secureTextEntry
                />
                <Button
                    title={isLoading ? "Loading..." : (isRegistering ? "Register" : "Login")}
                    onPress={handleSubmit}
                    disabled={isLoading}
                    color="#FF3D00"
                />
                <Button
                    title={isRegistering ? "Switch to Login" : "Switch to Register"}
                    onPress={() => setIsRegistering(!isRegistering)}
                    color="#4ECDC4"
                />
                <Button
                    title="Continue as Guest"
                    onPress={onSwitchToHome}
                    color="#FFD93D"
                />
            </View>
        </View>
    );
};