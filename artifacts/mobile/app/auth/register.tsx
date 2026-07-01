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

function Field({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  returnKeyType,
  onSubmitEditing,
  autoCapitalize,
  ref: _ref,
}: {
  label: string;
  icon: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboardType?: "default" | "phone-pad" | "email-address";
  secureTextEntry?: boolean;
  returnKeyType?: "next" | "done";
  onSubmitEditing?: () => void;
  autoCapitalize?: "none" | "words";
  ref?: React.RefObject<TextInput>;
}) {
  const colors = useColors();
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);

  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
      <View
        style={[
          styles.inputBox,
          {
            backgroundColor: colors.card,
            borderColor: focused ? "#00C896" : colors.border,
          },
        ]}
      >
        <Feather name={icon as any} size={17} color={focused ? "#00C896" : colors.mutedForeground} />
        <TextInput
          ref={_ref as any}
          style={[styles.input, { color: colors.foreground }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          keyboardType={keyboardType ?? "default"}
          secureTextEntry={secureTextEntry && !showPass}
          returnKeyType={returnKeyType ?? "done"}
          onSubmitEditing={onSubmitEditing}
          autoCapitalize={autoCapitalize ?? "none"}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setShowPass((v) => !v)} hitSlop={8}>
            <Feather name={showPass ? "eye-off" : "eye"} size={17} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const phoneRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const validate = () => {
    if (name.trim().length < 2) {
      Alert.alert("Invalid Name", "Please enter your full name (at least 2 characters).");
      return false;
    }
    const cleanPhone = phone.trim().replace(/\s/g, "");
    if (cleanPhone.length < 9) {
      Alert.alert("Invalid Phone", "Please enter a valid phone number.");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Passwords Don't Match", "Please make sure both passwords are the same.");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await register(name.trim(), phone.trim(), password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Sign Up Failed", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
            <Feather name="user-plus" size={26} color="#00C896" />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Sign up to start sending and receiving money instantly
          </Text>
        </View>

        {/* Form */}
        <Field
          label="Full Name"
          icon="user"
          value={name}
          onChangeText={setName}
          placeholder="Ahmad Karimi"
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => phoneRef.current?.focus()}
        />
        <Field
          label="Phone Number"
          icon="phone"
          value={phone}
          onChangeText={setPhone}
          placeholder="+93 700 000 000"
          keyboardType="phone-pad"
          returnKeyType="next"
          onSubmitEditing={() => passRef.current?.focus()}
          ref={phoneRef}
        />
        <Field
          label="Password"
          icon="lock"
          value={password}
          onChangeText={setPassword}
          placeholder="Minimum 6 characters"
          secureTextEntry
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
          ref={passRef}
        />
        <Field
          label="Confirm Password"
          icon="lock"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Re-enter your password"
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleSignUp}
          ref={confirmRef}
        />

        {/* Sign Up Button */}
        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            { backgroundColor: "#00C896", opacity: pressed || loading ? 0.8 : 1, marginTop: 8 },
          ]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Feather name="user-plus" size={18} color="#fff" />
          <Text style={styles.submitText}>{loading ? "Creating account…" : "Create Account"}</Text>
        </Pressable>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>or</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Already have account */}
        <Pressable
          style={({ pressed }) => [
            styles.loginBtn,
            { borderColor: colors.border, backgroundColor: colors.card, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => router.replace("/auth/login")}
        >
          <Feather name="log-in" size={18} color={colors.foreground} />
          <Text style={[styles.loginBtnText, { color: colors.foreground }]}>
            Already have an account? Sign In
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
  header: { marginBottom: 28, gap: 8 },
  headerIcon: {
    width: 56, height: 56, borderRadius: 16,
    alignItems: "center", justifyContent: "center", marginBottom: 4,
  },
  title: { fontSize: 28, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 21 },
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
  loginBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    borderRadius: 16, paddingVertical: 16, gap: 10, borderWidth: 1,
  },
  loginBtnText: { fontSize: 15, fontFamily: "Inter_500Medium" },
});
