import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function PasswordResetScreen() {
  const [input, setInput] = useState('');
  const router = useRouter();
  const { method } = useLocalSearchParams();
  
  const isEmail = method === 'email';
  const isValidInput = isEmail 
    ? input.includes('@') && input.includes('.')
    : input.length >= 10;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Forgot password</Text>
        <Text style={styles.subtitle}>
          Please enter your {isEmail ? 'email address' : 'phone number'} to reset{'\n'}your password instruction.
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons 
            name={isEmail ? "mail-outline" : "phone-portrait-outline"} 
            size={20} 
            color="#999" 
            style={styles.inputIcon} 
          />
          <TextInput
            style={styles.input}
            placeholder={isEmail ? "Email" : "Phone number"}
            placeholderTextColor="#999"
            value={input}
            onChangeText={setInput}
            keyboardType={isEmail ? "email-address" : "phone-pad"}
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity 
          style={[styles.sendButton, isValidInput && styles.sendButtonActive]}
          disabled={!isValidInput}
          onPress={() => isValidInput && router.push(`/reset-confirmation?method=${method}`)}
        >
          <Text style={styles.sendButtonText}>Send link</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 40,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#d1d5db',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#6366f1',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});