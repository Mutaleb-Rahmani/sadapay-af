import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { WalletProvider } from "@/context/WalletContext";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

/**
 * Rendered inside AuthProvider. Watches isLoggedIn and re-keys
 * the entire Stack on logout so navigation resets from scratch.
 */
function AppNavigator() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const [navKey, setNavKey] = useState(0);
  const prevLoggedIn = useRef<boolean | null>(null);

  // Detect sign-out: was logged in, now not logged in
  useEffect(() => {
    if (isLoading) return;
    if (prevLoggedIn.current === true && !isLoggedIn) {
      // Bump navKey to destroy + remount the entire Stack
      setNavKey((k) => k + 1);
    }
    prevLoggedIn.current = isLoggedIn;
  }, [isLoggedIn, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0D1117" }}>
        <ActivityIndicator color="#00C896" size="large" />
      </View>
    );
  }

  // Initial destination based on auth state
  const initialRoute = !user ? "/auth" : !isLoggedIn ? "/auth/login" : "/(tabs)";

  return (
    <Stack key={navKey} initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" initialParams={{ initialRoute }} />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth/index" />
      <Stack.Screen name="auth/register" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="send" options={{ presentation: "modal" }} />
      <Stack.Screen name="receive" options={{ presentation: "modal" }} />
      <Stack.Screen name="scan" options={{ presentation: "fullScreenModal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <WalletProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <KeyboardProvider>
                  <AppNavigator />
                </KeyboardProvider>
              </GestureHandlerRootView>
            </WalletProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
