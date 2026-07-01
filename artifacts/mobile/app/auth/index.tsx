import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: "#0D1117" }]}>
      {/* Top gradient hero */}
      <LinearGradient
        colors={["#00C896", "#007A5E"]}
        style={styles.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.heroContent, { paddingTop: insets.top + 40 }]}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoLetter}>S</Text>
          </View>
          <Text style={styles.heroTitle}>sadapay.af</Text>
          <Text style={styles.heroTagline}>Your digital wallet for Afghanistan</Text>

          <View style={styles.featureList}>
            {[
              { icon: "zap", text: "Instant money transfers" },
              { icon: "shield", text: "Secure & encrypted" },
              { icon: "smartphone", text: "QR code payments" },
            ].map((f) => (
              <View key={f.icon} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Feather name={f.icon as any} size={14} color="#007A5E" />
                </View>
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      {/* Bottom CTA */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 32 }]}>
        <Text style={[styles.bottomTitle, { color: colors.foreground }]}>
          Get started today
        </Text>
        <Text style={[styles.bottomSub, { color: colors.mutedForeground }]}>
          Create a free account or sign in to continue
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.btnPrimary,
            { backgroundColor: "#00C896", opacity: pressed ? 0.88 : 1 },
          ]}
          onPress={() => router.push("/auth/register")}
        >
          <Feather name="user-plus" size={18} color="#fff" />
          <Text style={styles.btnPrimaryText}>Create Account</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.btnSecondary,
            { borderColor: colors.border, backgroundColor: colors.card, opacity: pressed ? 0.88 : 1 },
          ]}
          onPress={() => router.push("/auth/login")}
        >
          <Feather name="log-in" size={18} color={colors.foreground} />
          <Text style={[styles.btnSecondaryText, { color: colors.foreground }]}>Sign In</Text>
        </Pressable>

        <Text style={[styles.terms, { color: colors.mutedForeground }]}>
          By continuing you agree to our{" "}
          <Text style={{ color: "#00C896" }}>Terms of Service</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { flex: 1.3 },
  heroContent: { flex: 1, paddingHorizontal: 28, paddingBottom: 32, justifyContent: "center" },
  logoCircle: {
    width: 64, height: 64, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center", justifyContent: "center", marginBottom: 16,
  },
  logoLetter: { fontSize: 34, fontFamily: "Inter_700Bold", color: "#fff" },
  heroTitle: { fontSize: 34, fontFamily: "Inter_700Bold", color: "#fff", marginBottom: 8 },
  heroTagline: { fontSize: 16, color: "rgba(255,255,255,0.8)", fontFamily: "Inter_400Regular", marginBottom: 36 },
  featureList: { gap: 12 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  featureIcon: {
    width: 30, height: 30, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center", justifyContent: "center",
  },
  featureText: { fontSize: 15, color: "rgba(255,255,255,0.9)", fontFamily: "Inter_500Medium" },
  bottom: { paddingHorizontal: 24, paddingTop: 32, gap: 12 },
  bottomTitle: { fontSize: 24, fontFamily: "Inter_700Bold", marginBottom: 4 },
  bottomSub: { fontSize: 14, fontFamily: "Inter_400Regular", marginBottom: 8 },
  btnPrimary: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    borderRadius: 16, paddingVertical: 16, gap: 10,
  },
  btnPrimaryText: { fontSize: 17, fontFamily: "Inter_600SemiBold", color: "#fff" },
  btnSecondary: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    borderRadius: 16, paddingVertical: 16, gap: 10, borderWidth: 1,
  },
  btnSecondaryText: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  terms: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center", marginTop: 4 },
});
