import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  name: string;
  details: string;
  isDefault: boolean;
}

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadPaymentMethods();
    }, [])
  );

  const loadPaymentMethods = async () => {
    try {
      const stored = await AsyncStorage.getItem('paymentMethods');
      console.log('Loaded payment methods:', stored);
      if (stored) {
        const methods = JSON.parse(stored);
        console.log('Parsed methods:', methods);
        setPaymentMethods(methods);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const savePaymentMethods = async (methods: PaymentMethod[]) => {
    try {
      await AsyncStorage.setItem('paymentMethods', JSON.stringify(methods));
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error saving payment methods:', error);
    }
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'paypal':
        return 'logo-paypal';
      case 'card':
      case 'visa':
      case 'mastercard':
        return 'card-outline';
      case 'apple_pay':
        return 'logo-apple';
      case 'google_pay':
        return 'logo-google';
      case 'phone':
        return 'phone-portrait-outline';
      default:
        return 'card-outline';
    }
  };

  const getPaymentColor = (type: string) => {
    switch (type) {
      case 'paypal':
        return '#0070ba';
      case 'card':
      case 'visa':
        return '#1a1f71';
      case 'mastercard':
        return '#eb001b';
      case 'apple_pay':
        return '#000';
      case 'google_pay':
        return '#4285f4';
      case 'phone':
        return '#28a745';
      default:
        return '#666';
    }
  };

  const handleSetDefault = async (id: string) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id,
    }));
    await savePaymentMethods(updatedMethods);
  };

  const handleDeleteMethod = (id: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedMethods = paymentMethods.filter(method => method.id !== id);
            await savePaymentMethods(updatedMethods);
          },
        },
      ]
    );
  };

  const handleAddPaymentMethod = () => {
    router.push('/add-payment-method');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {paymentMethods.length > 0 ? (
          <>
            {/* Payment Methods List */}
            <View style={styles.methodsList}>
              {paymentMethods.map((method) => (
                <View key={method.id} style={styles.methodCard}>
                  <View style={styles.methodInfo}>
                    <View style={[styles.methodIcon, { backgroundColor: getPaymentColor(method.type) + '20' }]}>
                      <Ionicons 
                        name={getPaymentIcon(method.type) as any} 
                        size={24} 
                        color={getPaymentColor(method.type)} 
                      />
                    </View>
                    <View style={styles.methodDetails}>
                      <Text style={styles.methodName}>{method.name}</Text>
                      <Text style={styles.methodNumber}>{method.details}</Text>
                      {method.isDefault && (
                        <Text style={styles.defaultLabel}>Default</Text>
                      )}
                    </View>
                  </View>
                  
                  <TouchableOpacity>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Add Payment Method Button */}
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddPaymentMethod}
            >
              <Ionicons name="add" size={24} color="#6366f1" />
              <Text style={styles.addButtonText}>Add Payment Method</Text>
            </TouchableOpacity>
          </>
        ) : (
          /* Empty State */
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="card-outline" size={60} color="#ccc" />
            </View>
            <Text style={styles.emptyTitle}>You don't have any</Text>
            <Text style={styles.emptySubtitle}>payment method. Add now.</Text>
            
            <TouchableOpacity 
              style={styles.addNewButton}
              onPress={handleAddPaymentMethod}
            >
              <Text style={styles.addNewButtonText}>Add New</Text>
            </TouchableOpacity>
          </View>
        )}
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
  methodsList: {
    paddingTop: 20,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodDetails: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  methodNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  defaultLabel: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '500',
  },
  methodActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#6366f1',
    borderRadius: 6,
  },
  setDefaultText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#6366f1',
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyIcon: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 32,
  },
  addNewButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addNewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});