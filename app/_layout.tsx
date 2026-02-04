import { Stack } from "expo-router";
import LoadingScreen from "../src/components/LoadingScreen";
import { AuthProvider, useAuth } from "../src/services/authContext";

function RootLayoutNav() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
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
      <Stack.Screen name="payment-methods" />
      <Stack.Screen name="faqs" />
      <Stack.Screen name="chat-conversation" />
      <Stack.Screen name="voice-call" />
      <Stack.Screen name="video-call" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
