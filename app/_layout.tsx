import { Stack } from "expo-router";

export default function RootLayout() {
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
    </Stack>
  );
}
