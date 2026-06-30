import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

function PinDots({ value, length = 6 }: { value: string; length?: number }) {
  const colors = useColors();
  return (
    <View style={styles.pinDots}>
      {Array.from({ length }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.pinDot,
            {
              backgroundColor: i < value.length ? colors.primary : colors.border,
              borderColor: i < value.length ? colors.primary : colors.border,
            },
          ]}
        />
      ))}
    </View>
  );
}

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, login } = useAuth();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePinInput = async (digit: string) => {
    if (loading || pin.length >= 6) return;
    const next = pin + digit;
    setPin(next);
    Haptics.selectionAsync();
    if (next.length === 6) {
      setLoading(true);
      const ok = await login(user?.phone ?? "", next);
      if (ok) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace("/(tabs)");
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Wrong PIN", "The PIN you entered is incorrect. Please try again.", [
          { text: "OK", onPress: () => { setPin(""); setLoading(false); } },
        ]);
        setLoading(false);
      }
    }
  };

  const handleBackspace = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPin((p) => p.slice(0, -1));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}>
      {/* Logo */}
      <View style={styles.logoRow}>
        <View style={[styles.logo, { backgroundColor: colors.primary }]}>
          <Text style={[styles.logoText, { color: colors.primaryForeground }]}>S</Text>
        </View>
        <Text style={[styles.brand, { color: colors.foreground }]}>sadapay.af</Text>
      </View>

      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
        <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>
          {user?.name?.[0]?.toUpperCase() ?? "?"}
        </Text>
      </View>
      <Text style={[styles.welcomeBack, { color: colors.foreground }]}>
        Welcome back,
      </Text>
      <Text style={[styles.userName, { color: colors.foreground }]}>
        {user?.name ?? "User"}
      </Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        Enter your 6-digit PIN to continue
      </Text>

      <PinDots value={pin} />

      {/* Keypad */}
      <View style={styles.keypad}>
        {[["1","2","3"],["4","5","6"],["7","8","9"],["","0","⌫"]].map((row, ri) => (
          <View key={ri} style={styles.keypadRow}>
            {row.map((key, ki) => (
              <Pressable
                key={ki}
                style={({ pressed }) => [
                  styles.keypadBtn,
                  { backgroundColor: key ? (pressed ? colors.card : "transparent") : "transparent" },
                ]}
                onPress={() => key === "⌫" ? handleBackspace() : key ? handlePinInput(key) : null}
                disabled={loading}
              >
                <Text style={[styles.keypadText, { color: key === "⌫" ? colors.mutedForeground : colors.foreground }]}>
                  {key}
                </Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>

      {/* Switch account */}
      <Pressable
        style={styles.switchBtn}
        onPress={() => {
          Alert.alert(
            "Switch Account",
            "This will remove the current account and take you to registration.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Continue",
                style: "destructive",
                onPress: () => router.replace("/auth/register"),
              },
            ]
          );
        }}
      >
        <Text style={[styles.switchText, { color: colors.mutedForeground }]}>
          Not you? <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>Switch account</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingHorizontal: 24 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 40, alignSelf: "flex-start" },
  logo: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  logoText: { fontSize: 20, fontFamily: "Inter_700Bold" },
  brand: { fontSize: 20, fontFamily: "Inter_700Bold" },
  avatar: { width: 68, height: 68, borderRadius: 34, alignItems: "center", justifyContent: "center", marginBottom: 14 },
  avatarText: { fontSize: 28, fontFamily: "Inter_700Bold" },
  welcomeBack: { fontSize: 16, fontFamily: "Inter_400Regular", marginBottom: 2 },
  userName: { fontSize: 24, fontFamily: "Inter_700Bold", marginBottom: 8 },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", marginBottom: 32 },
  pinDots: { flexDirection: "row", gap: 14, justifyContent: "center", marginBottom: 40 },
  pinDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2 },
  keypad: { gap: 8, width: "100%" },
  keypadRow: { flexDirection: "row", justifyContent: "center", gap: 16 },
  keypadBtn: { width: 80, height: 72, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  keypadText: { fontSize: 26, fontFamily: "Inter_400Regular" },
  switchBtn: { marginTop: 28 },
  switchText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
