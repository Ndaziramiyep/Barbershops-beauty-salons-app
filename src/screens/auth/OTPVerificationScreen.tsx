import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../services/authContext';

export default function OTPVerificationScreen() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();
  const { email, isLogin } = useLocalSearchParams();
  const { login } = useAuth();
  
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
      setTimerActive(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, timerActive]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    
    if (value === '') {
      // Handle backspace - move to previous input
      newOtp[index] = '';
      setOtp(newOtp);
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else {
      // Handle input - move to next input
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
      
      // Auto-verify when all 4 digits are entered
      if (index === 3 && value) {
        const otpCode = newOtp.join('');
        if (otpCode.length === 4) {
          setTimeout(() => handleVerify(otpCode), 100);
        }
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '') {
      // If current field is empty and backspace is pressed, go to previous field
      if (index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleResend = async () => {
    if (!canResend || resendLoading) return;
    
    setResendLoading(true);
    try {
      await apiService.resendOTP({ email: email as string });
      Alert.alert('Success', 'OTP has been resent to your email');
      setCountdown(60);
      setCanResend(false);
      setTimerActive(true);
      setOtp(['', '', '', '']); // Clear current OTP
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join('');
    if (code.length !== 4) {
      Alert.alert('Error', 'Please enter the complete OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.verifyOTP({ email: email as string, otp: code });
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Auto-close modal and navigate after 2 seconds
      setTimeout(async () => {
        setShowSuccessModal(false);
        await login(response.token, response.user);
        router.replace('/home');
      }, 2000);
      
    } catch (error: any) {
      Alert.alert('Verification Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>
          Enter the 4-digit code sent to{'\n'}{email}
        </Text>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref!)}
            style={[styles.otpInput, digit && styles.otpInputFilled]}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="numeric"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>

      <TouchableOpacity 
        style={[styles.verifyButton, (loading || otp.join('').length === 4) && styles.verifyButtonDisabled]} 
        onPress={() => handleVerify()}
        disabled={loading || otp.join('').length === 4}
      >
        <Text style={styles.verifyButtonText}>
          {loading ? 'Verifying...' : otp.join('').length === 4 ? 'Auto-verifying...' : 'Verify'}
        </Text>
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive the code? </Text>
        <TouchableOpacity 
          onPress={handleResend}
          disabled={!canResend || resendLoading}
        >
          <Text style={[styles.resendLink, (!canResend || resendLoading) && styles.resendDisabled]}>
            {resendLoading ? 'Sending...' : canResend ? 'Resend' : `Resend in ${countdown}s`}
          </Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
      
      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={60} color="#28a745" />
            </View>
            <Text style={styles.successTitle}>OTP Verified!</Text>
            <Text style={styles.successMessage}>Welcome to the app</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  backButton: {
    marginTop: 20,
    marginBottom: 40,
  },
  headerContainer: {
    marginBottom: 60,
    alignItems: 'center',
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
    textAlign: 'center',
    lineHeight: 24,
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
  },
  otpInputFilled: {
    backgroundColor: '#e0e7ff',
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  verifyButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  verifyButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendLink: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
  resendDisabled: {
    color: '#9ca3af',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});