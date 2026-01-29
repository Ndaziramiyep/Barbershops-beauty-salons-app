import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ResetConfirmationScreen() {
  const router = useRouter();
  const { method } = useLocalSearchParams();
  
  const isEmail = method === 'email';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={isEmail ? "mail-outline" : "chatbubble-outline"} 
            size={64} 
            color="#333" 
          />
        </View>

        <Text style={styles.title}>Code has been sent</Text>
        
        <Text style={styles.subtitle}>
          You'll shortly receive an {isEmail ? 'email' : 'SMS'} with a{'\n'}code to setup a new password.
        </Text>

        <TouchableOpacity 
          style={styles.doneButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.doneButtonText}>Done</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 48,
  },
  doneButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});