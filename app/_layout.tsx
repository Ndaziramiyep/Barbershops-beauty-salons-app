import { Stack } from "expo-router";
import { AuthProvider } from "../src/services/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="phone-verification" />
        <Stack.Screen name="otp-verification" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="password-reset" />
        <Stack.Screen name="reset-confirmation" />
        <Stack.Screen name="home" />
        <Stack.Screen name="location" />
        <Stack.Screen name="booking" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="faqs" />
      </Stack>
    </AuthProvider>
  );
}
