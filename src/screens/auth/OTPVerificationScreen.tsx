import React, { useState, useRef, useEffect } from 'react';
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
import { useRouter } from 'expo-router';

export default function OTPVerificationScreen() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(40);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
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
      verifyOTP(newOtp);
    }
  };

  const verifyOTP = (otpArray: string[]) => {
    setIsVerifying(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1500);
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Verify phone</Text>
        <Text style={styles.subtitle}>
          Please enter the 4-digit security code we{'\n'}just sent you at{' '}
          <Text style={styles.phoneNumber}>733-444-xxxx</Text>
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
            <Text style={styles.resendText}>Resend in {resendTimer} Sec</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.resendContainer}
            onPress={() => {
              setResendTimer(40);
              setOtp(['', '', '', '']);
              setIsVerified(false);
              setIsVerifying(false);
            }}
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
          onPress={() => (isOtpComplete || isVerified) && router.push('/home')}
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