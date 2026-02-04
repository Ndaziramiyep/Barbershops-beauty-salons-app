import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface PaymentOption {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay' | 'phone';
  name: string;
  icon: string;
  color: string;
}

export default function AddPaymentMethodScreen() {
  const router = useRouter();

  const paymentOptions: PaymentOption[] = [
    {
      id: '1',
      type: 'card',
      name: 'Credit/Debit Card',
      icon: 'card-outline',
      color: '#6366f1',
    },
    {
      id: '2',
      type: 'paypal',
      name: 'PayPal',
      icon: 'logo-paypal',
      color: '#0070ba',
    },
    {
      id: '3',
      type: 'apple_pay',
      name: 'Apple Pay',
      icon: 'logo-apple',
      color: '#000',
    },
    {
      id: '4',
      type: 'google_pay',
      name: 'Google Pay',
      icon: 'logo-google',
      color: '#4285f4',
    },
    {
      id: '5',
      type: 'phone',
      name: 'Mobile Money',
      icon: 'phone-portrait-outline',
      color: '#28a745',
    },
  ];

  const handleSelectPaymentMethod = (type: string) => {
    if (type === 'card') {
      router.push('/add-card');
    } else {
      // For other payment methods, we'll create a generic form
      router.push(`/add-card?type=${type}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Payment Method</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Choose a payment method to add</Text>
        
        <View style={styles.optionsList}>
          {paymentOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => handleSelectPaymentMethod(option.type)}
            >
              <View style={[styles.optionIcon, { backgroundColor: option.color + '20' }]}>
                <Ionicons name={option.icon as any} size={24} color={option.color} />
              </View>
              <Text style={styles.optionName}>{option.name}</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    marginBottom: 24,
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});