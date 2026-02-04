import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddCardScreen() {
  const router = useRouter();
  const { type = 'card' } = useLocalSearchParams();
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [accountName, setAccountName] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(false);

  const getPaymentTypeInfo = () => {
    switch (type) {
      case 'paypal':
        return { title: 'Add PayPal', icon: 'logo-paypal', color: '#0070ba' };
      case 'apple_pay':
        return { title: 'Add Apple Pay', icon: 'logo-apple', color: '#000' };
      case 'google_pay':
        return { title: 'Add Google Pay', icon: 'logo-google', color: '#4285f4' };
      case 'phone':
        return { title: 'Add Mobile Money', icon: 'phone-portrait-outline', color: '#28a745' };
      default:
        return { title: 'Add Card', icon: 'card', color: '#6366f1' };
    }
  };

  const validateFields = () => {
    switch (type) {
      case 'card':
        return cardNumber && cardHolder && expDate && cvv;
      case 'paypal':
        return email && accountName;
      case 'phone':
        return phoneNumber && accountName;
      case 'apple_pay':
      case 'google_pay':
        return accountName;
      default:
        return false;
    }
  };

  const getPaymentDetails = () => {
    switch (type) {
      case 'card':
        return `**** **** **** ${cardNumber.slice(-4)}`;
      case 'paypal':
        return email;
      case 'phone':
        return phoneNumber;
      case 'apple_pay':
      case 'google_pay':
        return accountName;
      default:
        return '';
    }
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.substring(0, 19);
  };

  const formatExpDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
  };

  const handleExpDateChange = (text: string) => {
    const formatted = formatExpDate(text);
    setExpDate(formatted);
  };

  const handleAddCard = async () => {
    if (!validateFields()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const stored = await AsyncStorage.getItem('paymentMethods');
      const existingMethods = stored ? JSON.parse(stored) : [];
      
      const newPaymentMethod = {
        id: Date.now().toString(),
        type: type as string,
        name: type === 'card' ? getCardType() : getPaymentTypeInfo().title.replace('Add ', ''),
        details: getPaymentDetails(),
        isDefault: setAsDefault || existingMethods.length === 0,
      };
      
      const updatedMethods = setAsDefault 
        ? existingMethods.map((method: any) => ({ ...method, isDefault: false }))
        : existingMethods;
      
      updatedMethods.push(newPaymentMethod);
      
      await AsyncStorage.setItem('paymentMethods', JSON.stringify(updatedMethods));
      
      Alert.alert('Success', 'Payment method added successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error adding payment method:', error);
      Alert.alert('Error', 'Failed to add payment method');
    }
  };

  const getCardType = () => {
    const firstDigit = cardNumber.charAt(0);
    if (firstDigit === '4') return 'VISA';
    if (firstDigit === '5') return 'MASTERCARD';
    return 'VISA';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getPaymentTypeInfo().title}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {type === 'card' ? (
          <>
            {/* Card Preview */}
            <View style={styles.cardPreview}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="card" size={24} color="#fff" />
                  <Text style={styles.cardType}>{getCardType()}</Text>
                </View>
                
                <Text style={styles.cardNumberDisplay}>
                  {cardNumber || '4550 4545 1234 9876'}
                </Text>
                
                <View style={styles.cardFooter}>
                  <Text style={styles.cardHolderDisplay}>
                    {cardHolder || 'Jenny Wilson'}
                  </Text>
                  <Text style={styles.cardExpDisplay}>
                    {expDate || '03/22'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Card Form Fields */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Card number</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="card-outline" size={20} color="#999" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="4550 4545 1234 9876"
                    value={cardNumber}
                    onChangeText={handleCardNumberChange}
                    keyboardType="numeric"
                    maxLength={19}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Card holder</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Jenny Wilson"
                  value={cardHolder}
                  onChangeText={setCardHolder}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Exp Date</Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder="MM/YY"
                    value={expDate}
                    onChangeText={handleExpDateChange}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>

                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder="000"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
          </>
        ) : (
          /* Other Payment Methods Form */
          <View style={styles.form}>
            <View style={styles.paymentTypeHeader}>
              <View style={[styles.paymentTypeIcon, { backgroundColor: getPaymentTypeInfo().color + '20' }]}>
                <Ionicons name={getPaymentTypeInfo().icon as any} size={32} color={getPaymentTypeInfo().color} />
              </View>
              <Text style={styles.paymentTypeName}>{getPaymentTypeInfo().title}</Text>
            </View>

            {type === 'paypal' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder="jenny.wilson@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Account Name</Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Jenny Wilson"
                    value={accountName}
                    onChangeText={setAccountName}
                  />
                </View>
              </>
            )}

            {type === 'phone' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder="+1 234 567 8900"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Account Name</Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Jenny Wilson"
                    value={accountName}
                    onChangeText={setAccountName}
                  />
                </View>
              </>
            )}

            {(type === 'apple_pay' || type === 'google_pay') && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Account Name</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Jenny Wilson"
                  value={accountName}
                  onChangeText={setAccountName}
                />
              </View>
            )}
          </View>
        )}

        {/* Default Payment Method Checkbox */}
        <View style={styles.form}>
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setSetAsDefault(!setAsDefault)}
          >
            <View style={[styles.checkbox, setAsDefault && styles.checkboxChecked]}>
              {setAsDefault && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <Text style={styles.checkboxLabel}>Set as your default payment method</Text>
          </TouchableOpacity>

          {/* Add Button */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
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
  },
  cardPreview: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  card: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    padding: 20,
    height: 200,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardNumberDisplay: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHolderDisplay: {
    color: '#fff',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  cardExpDisplay: {
    color: '#fff',
    fontSize: 14,
  },
  form: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  inputField: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#6366f1',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6366f1',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#6366f1',
    flex: 1,
  },
  addButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentTypeHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  paymentTypeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  paymentTypeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});