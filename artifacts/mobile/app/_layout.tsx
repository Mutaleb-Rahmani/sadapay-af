import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, router, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
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
 * Watches auth state from inside the provider tree.
 * useSegments tells us where the user currently is so we
 * only redirect when needed and avoid infinite loops.
 */
function AuthWatcher() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "auth";
    const inTabs = segments[0] === "(tabs)";

    if (!user) {
      // No account at all → welcome screen
      if (!inAuthGroup) router.replace("/auth");
    } else if (!isLoggedIn) {
      // Has account but not logged in → login
      if (!inAuthGroup) router.replace("/auth/login");
    } else {
      // Logged in → dashboard; leave if already there
      if (inAuthGroup) router.replace("/(tabs)");
    }
  }, [user, isLoggedIn, isLoading, segments]);

  return null;
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0D1117" }}>
      <ActivityIndicator color="#00C896" size="large" />
    </View>
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

  if (!fontsLoaded && !fontError) return <LoadingScreen />;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <WalletProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <KeyboardProvider>
                  {/* Navigator — always mounted so router.replace() works everywhere */}
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="auth/index" />
                    <Stack.Screen name="auth/register" />
                    <Stack.Screen name="auth/login" />
                    <Stack.Screen name="send" options={{ presentation: "modal" }} />
                    <Stack.Screen name="receive" options={{ presentation: "modal" }} />
                    <Stack.Screen name="scan" options={{ presentation: "fullScreenModal" }} />
                  </Stack>
                  {/* Global auth watcher — redirects on login/logout from anywhere */}
                  <AuthWatcher />
                </KeyboardProvider>
              </GestureHandlerRootView>
            </WalletProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
