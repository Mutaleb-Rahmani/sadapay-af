import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();
  const [step, setStep] = useState<"info" | "pin" | "confirm">("info");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const phoneRef = useRef<TextInput>(null);

  const handleInfoNext = () => {
    if (name.trim().length < 2) {
      Alert.alert("Invalid Name", "Please enter your full name.");
      return;
    }
    if (phone.trim().length < 10) {
      Alert.alert("Invalid Phone", "Please enter a valid phone number.");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep("pin");
  };

  const handlePinInput = (digit: string) => {
    if (step === "pin") {
      if (pin.length < 6) {
        const next = pin + digit;
        setPin(next);
        Haptics.selectionAsync();
        if (next.length === 6) {
          setTimeout(() => setStep("confirm"), 300);
        }
      }
    } else if (step === "confirm") {
      if (confirmPin.length < 6) {
        const next = confirmPin + digit;
        setConfirmPin(next);
        Haptics.selectionAsync();
        if (next.length === 6) {
          setTimeout(() => handleRegister(next), 300);
        }
      }
    }
  };

  const handleBackspace = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step === "pin") setPin((p) => p.slice(0, -1));
    else setConfirmPin((p) => p.slice(0, -1));
  };

  const handleRegister = async (confirmedPin: string) => {
    if (pin !== confirmedPin) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("PINs Don't Match", "The PINs you entered don't match. Please try again.", [
        { text: "OK", onPress: () => { setStep("pin"); setPin(""); setConfirmPin(""); } },
      ]);
      return;
    }
    setLoading(true);
    try {
      await register(name.trim(), phone.trim(), pin);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    } catch (_) {
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderKeypad = () => (
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
            >
              <Text style={[styles.keypadText, { color: key === "⌫" ? colors.mutedForeground : colors.foreground }]}>
                {key}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <Text style={[styles.logoText, { color: colors.primaryForeground }]}>S</Text>
          </View>
          <Text style={[styles.brand, { color: colors.foreground }]}>sadapay.af</Text>
        </View>

        {step === "info" && (
          <>
            <Text style={[styles.title, { color: colors.foreground }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Enter your details to get started
            </Text>

            <Text style={[styles.label, { color: colors.mutedForeground }]}>Full Name</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="user" size={18} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                value={name}
                onChangeText={setName}
                placeholder="Ahmad Karimi"
                placeholderTextColor={colors.mutedForeground}
                returnKeyType="next"
                onSubmitEditing={() => phoneRef.current?.focus()}
                autoCapitalize="words"
              />
            </View>

            <Text style={[styles.label, { color: colors.mutedForeground }]}>Phone Number</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="phone" size={18} color={colors.mutedForeground} />
              <TextInput
                ref={phoneRef}
                style={[styles.input, { color: colors.foreground }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="+93 700 000 000"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="phone-pad"
                returnKeyType="done"
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.btn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1, marginTop: 8 },
              ]}
              onPress={handleInfoNext}
            >
              <Text style={[styles.btnText, { color: colors.primaryForeground }]}>Continue</Text>
              <Feather name="arrow-right" size={18} color={colors.primaryForeground} />
            </Pressable>

            <Pressable style={styles.loginLink} onPress={() => router.replace("/auth/login")}>
              <Text style={[styles.loginLinkText, { color: colors.mutedForeground }]}>
                Already have an account?{" "}
                <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>Sign In</Text>
              </Text>
            </Pressable>
          </>
        )}

        {(step === "pin" || step === "confirm") && (
          <>
            <Pressable onPress={() => step === "confirm" ? (setStep("pin"), setConfirmPin("")) : setStep("info")} style={styles.backBtn}>
              <Feather name="arrow-left" size={20} color={colors.foreground} />
            </Pressable>
            <Text style={[styles.title, { color: colors.foreground }]}>
              {step === "pin" ? "Create PIN" : "Confirm PIN"}
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {step === "pin"
                ? "Create a 6-digit PIN to secure your wallet"
                : "Re-enter your PIN to confirm"}
            </Text>
            <PinDots value={step === "pin" ? pin : confirmPin} />
            {renderKeypad()}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 36 },
  logo: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  logoText: { fontSize: 22, fontFamily: "Inter_700Bold" },
  brand: { fontSize: 22, fontFamily: "Inter_700Bold" },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", marginBottom: 8 },
  subtitle: { fontSize: 15, fontFamily: "Inter_400Regular", marginBottom: 32, lineHeight: 22 },
  label: { fontSize: 12, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5, marginBottom: 8 },
  inputBox: {
    flexDirection: "row", alignItems: "center", borderRadius: 14, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 14, gap: 10, marginBottom: 16,
  },
  input: { flex: 1, fontSize: 16, fontFamily: "Inter_400Regular" },
  btn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    borderRadius: 16, paddingVertical: 17, gap: 8,
  },
  btnText: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  loginLink: { alignItems: "center", marginTop: 24 },
  loginLinkText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  backBtn: { marginBottom: 24 },
  pinDots: { flexDirection: "row", gap: 14, justifyContent: "center", marginBottom: 40 },
  pinDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2 },
  keypad: { gap: 8 },
  keypadRow: { flexDirection: "row", justifyContent: "center", gap: 16 },
  keypadBtn: {
    width: 80, height: 72, borderRadius: 16, alignItems: "center", justifyContent: "center",
  },
  keypadText: { fontSize: 26, fontFamily: "Inter_400Regular" },
});
