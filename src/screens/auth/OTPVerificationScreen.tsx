import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../services/authContext';

export default function OTPVerificationScreen() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(120); // 2 minutes
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const params = useLocalSearchParams();
  const email = params.email as string || '';
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 4 digits are entered
    if (newOtp.every(digit => digit !== '')) {
      verifyOTP(newOtp.join(''));
    }
  };

  const verifyOTP = async (otpCode: string) => {
    setIsVerifying(true);
    try {
      const response = await apiService.verifyOTP({ email, otp: otpCode });
      await login(response.token, response.user);
      setIsVerified(true);
      Alert.alert('Success', 'Email verified successfully!', [
        { text: 'OK', onPress: () => router.replace('/home') }
      ]);
    } catch (error: any) {
      Alert.alert('Verification Failed', error.message);
      setOtp(['', '', '', '']);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await apiService.resendOTP({ email });
      setResendTimer(120);
      setOtp(['', '', '', '']);
      setIsVerified(false);
      setIsVerifying(false);
      Alert.alert('Success', 'New OTP sent to your email');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Verify Email</Text>
        <Text style={styles.subtitle}>
          Please enter the 4-digit security code we sent to your email{' '}
          <Text style={styles.phoneNumber}>{email}</Text>
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled,
                isVerified && digit && styles.otpInputVerified,
                isVerifying && digit && styles.otpInputVerifying
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              editable={!isVerified && !isVerifying}
            />
          ))}
        </View>

        {resendTimer > 0 ? (
          <TouchableOpacity style={styles.resendContainer}>
            <Text style={styles.resendText}>Resend in {formatTime(resendTimer)}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.resendContainer}
            onPress={handleResendOTP}
          >
            <Text style={styles.resendActiveText}>Resend Code</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[
            styles.continueButton, 
            (isOtpComplete || isVerified) && styles.continueButtonActive
          ]}
          disabled={!isOtpComplete && !isVerified}
          onPress={() => (isOtpComplete || isVerified) && router.replace('/home')}
        >
          <Text style={styles.continueButtonText}>
            {isVerifying ? 'Verifying...' : 'Continue'}
          </Text>
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
  phoneNumber: {
    color: '#6366f1',
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  otpInputFilled: {
    backgroundColor: '#e8f4fd',
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  otpInputVerified: {
    backgroundColor: '#dcfce7',
    borderColor: '#10b981',
  },
  otpInputVerifying: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  resendText: {
    fontSize: 14,
    color: '#6366f1',
  },
  resendActiveText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  continueButton: {
    backgroundColor: '#d1d5db',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 32,
  },
  continueButtonActive: {
    backgroundColor: '#6366f1',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});