import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const countries = [
  { code: "+1", flag: "🇺🇸", name: "United States", maxLength: 10 },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom", maxLength: 10 },
  { code: "+33", flag: "🇫🇷", name: "France", maxLength: 9 },
  { code: "+49", flag: "🇩🇪", name: "Germany", maxLength: 11 },
  { code: "+84", flag: "🇻🇳", name: "Vietnam", maxLength: 9 },
  { code: "+86", flag: "🇨🇳", name: "China", maxLength: 11 },
  { code: "+81", flag: "🇯🇵", name: "Japan", maxLength: 10 },
  { code: "+82", flag: "🇰🇷", name: "South Korea", maxLength: 10 },
];

export default function PhoneVerificationScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[4]); // Vietnam default
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [isValidNumber, setIsValidNumber] = useState(false);
  const router = useRouter();

  const handlePhoneChange = (text: string) => {
    const cleanNumber = text.replace(/[^0-9]/g, "");
    if (cleanNumber.length <= selectedCountry.maxLength) {
      setPhoneNumber(cleanNumber);
      setIsValidNumber(cleanNumber.length === selectedCountry.maxLength);
    }
  };

  const selectCountry = (country: (typeof countries)[0]) => {
    setSelectedCountry(country);
    setPhoneNumber("");
    setIsValidNumber(false);
    setShowCountryModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Your phone!</Text>
        <Text style={styles.subtitle}>
          A 4 digit security code will be sent via SMS{"\n"}to verify your
          mobile number
        </Text>

        <View
          style={[
            styles.phoneContainer,
            isValidNumber && styles.phoneContainerValid,
          ]}
        >
          <TouchableOpacity
            style={styles.countryCode}
            onPress={() => setShowCountryModal(true)}
          >
            <Text style={styles.flag}>{selectedCountry.flag}</Text>
            <Text style={styles.codeText}>{selectedCountry.code}</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>

          <TextInput
            style={styles.phoneInput}
            placeholder="Enter number"
            placeholderTextColor="#999"
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            maxLength={selectedCountry.maxLength}
          />

          {isValidNumber && (
            <View style={styles.validIcon}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            isValidNumber && styles.continueButtonActive,
          ]}
          onPress={() => isValidNumber && router.push("/otp-verification")}
          disabled={!isValidNumber}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showCountryModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <TouchableOpacity onPress={() => setShowCountryModal(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={countries}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.countryItem}
                onPress={() => selectCountry(item)}
              >
                <Text style={styles.countryFlag}>{item.flag}</Text>
                <Text style={styles.countryName}>{item.name}</Text>
                <Text style={styles.countryCode}>{item.code}</Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 40,
  },
  phoneContainer: {
    flexDirection: "row",
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    padding: 4,
  },
  phoneContainerValid: {
    borderColor: "#10b981",
  },
  countryCode: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 120,
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  codeText: {
    fontSize: 16,
    color: "#333",
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#333",
  },
  validIcon: {
    justifyContent: "center",
    paddingRight: 12,
  },
  continueButton: {
    backgroundColor: "#d1d5db",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueButtonActive: {
    backgroundColor: "#6366f1",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 16,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  countryCode: {
    fontSize: 16,
    color: "#666",
  },
});
