import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { user, isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/auth");
    } else if (!isLoggedIn) {
      router.replace("/auth/login");
    } else {
      router.replace("/(tabs)");
    }
  }, [user, isLoggedIn, isLoading]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0D1117" }}>
      <ActivityIndicator color="#00C896" size="large" />
    </View>
  );
}
