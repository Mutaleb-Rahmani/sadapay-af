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

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, login } = useAuth();

  const [phone, setPhone] = useState(user?.phone ?? "");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const passRef = useRef<TextInput>(null);

  const handleSignIn = async () => {
    if (!phone.trim() || !password) {
      Alert.alert("Missing Fields", "Please enter your phone number and password.");
      return;
    }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const ok = await login(phone.trim(), password);
    setLoading(false);
    if (ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Sign In Failed", "Phone number or password is incorrect. Please try again.");
      setPassword("");
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>

        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: "#00C89620" }]}>
            <Feather name="log-in" size={26} color="#00C896" />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Sign in to your sadapay.af account to continue
          </Text>
        </View>

        {/* User avatar if known */}
        {user && (
          <View style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: "#00C896" }]}>
              <Text style={styles.avatarText}>{user.name[0]?.toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.userName, { color: colors.foreground }]}>{user.name}</Text>
              <Text style={[styles.userPhone, { color: colors.mutedForeground }]}>{user.phone}</Text>
            </View>
            <Feather name="check-circle" size={18} color="#00C896" />
          </View>
        )}

        {/* Phone field */}
        <View style={styles.fieldWrap}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Phone Number</Text>
          <View
            style={[
              styles.inputBox,
              { backgroundColor: colors.card, borderColor: phoneFocused ? "#00C896" : colors.border },
            ]}
          >
            <Feather name="phone" size={17} color={phoneFocused ? "#00C896" : colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              value={phone}
              onChangeText={setPhone}
              placeholder="+93 700 000 000"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="phone-pad"
              returnKeyType="next"
              onSubmitEditing={() => passRef.current?.focus()}
              onFocus={() => setPhoneFocused(true)}
              onBlur={() => setPhoneFocused(false)}
            />
          </View>
        </View>

        {/* Password field */}
        <View style={styles.fieldWrap}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Password</Text>
          <View
            style={[
              styles.inputBox,
              { backgroundColor: colors.card, borderColor: passFocused ? "#00C896" : colors.border },
            ]}
          >
            <Feather name="lock" size={17} color={passFocused ? "#00C896" : colors.mutedForeground} />
            <TextInput
              ref={passRef}
              style={[styles.input, { color: colors.foreground }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              placeholderTextColor={colors.mutedForeground}
              secureTextEntry={!showPass}
              returnKeyType="done"
              onSubmitEditing={handleSignIn}
              onFocus={() => setPassFocused(true)}
              onBlur={() => setPassFocused(false)}
            />
            <Pressable onPress={() => setShowPass((v) => !v)} hitSlop={8}>
              <Feather name={showPass ? "eye-off" : "eye"} size={17} color={colors.mutedForeground} />
            </Pressable>
          </View>
        </View>

        {/* Sign In Button */}
        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            { backgroundColor: "#00C896", opacity: pressed || loading ? 0.8 : 1, marginTop: 8 },
          ]}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Feather name="log-in" size={18} color="#fff" />
          <Text style={styles.submitText}>{loading ? "Signing in…" : "Sign In"}</Text>
        </Pressable>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>or</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Create account */}
        <Pressable
          style={({ pressed }) => [
            styles.registerBtn,
            { borderColor: colors.border, backgroundColor: colors.card, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => router.replace("/auth/register")}
        >
          <Feather name="user-plus" size={18} color={colors.foreground} />
          <Text style={[styles.registerBtnText, { color: colors.foreground }]}>
            Don't have an account? Sign Up
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24 },
  backBtn: { marginBottom: 20, width: 36 },
  header: { marginBottom: 24, gap: 8 },
  headerIcon: {
    width: 56, height: 56, borderRadius: 16,
    alignItems: "center", justifyContent: "center", marginBottom: 4,
  },
  title: { fontSize: 28, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 21 },
  userCard: {
    flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 16,
    padding: 14, borderWidth: 1, marginBottom: 24,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#fff" },
  userName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  userPhone: { fontSize: 13, fontFamily: "Inter_400Regular" },
  fieldWrap: { marginBottom: 16 },
  label: { fontSize: 12, fontFamily: "Inter_600SemiBold", letterSpacing: 0.4, marginBottom: 8 },
  inputBox: {
    flexDirection: "row", alignItems: "center", gap: 10,
    borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 14,
  },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  submitBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    borderRadius: 16, paddingVertical: 17, gap: 10,
  },
  submitText: { fontSize: 17, fontFamily: "Inter_600SemiBold", color: "#fff" },
  divider: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 16 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  registerBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    borderRadius: 16, paddingVertical: 16, gap: 10, borderWidth: 1,
  },
  registerBtnText: { fontSize: 15, fontFamily: "Inter_500Medium" },
});
