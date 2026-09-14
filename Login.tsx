import React, {useState} from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import {supabase} from './supabase';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        if (!email || !password) {
            Alert.alert('Please enter both email and password');
            return;
        }

        setLoading(true);

        const {error} = isSignUp
            ? await supabase.auth.signUp({ email: email.trim(), password })
            : await supabase.auth.signInWithPassword({ email: email.trim(), password });
        setLoading(false);

        if (error) {
            Alert.alert('Error', error.message);
        } else if (isSignUp) {
            Alert.alert('Account successfully created')
        }
    }
}