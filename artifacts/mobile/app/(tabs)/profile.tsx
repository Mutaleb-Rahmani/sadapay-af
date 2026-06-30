import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

function SettingRow({
  icon,
  label,
  sublabel,
  onPress,
  rightElement,
}: {
  icon: string;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}) {
  const colors = useColors();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.border, opacity: pressed && onPress ? 0.7 : 1 },
      ]}
      onPress={onPress}
    >
      <View style={[styles.rowIcon, { backgroundColor: colors.accent }]}>
        <Feather name={icon as any} size={18} color={colors.primary} />
      </View>
      <View style={styles.rowInfo}>
        <Text style={[styles.rowLabel, { color: colors.foreground }]}>{label}</Text>
        {sublabel && (
          <Text style={[styles.rowSublabel, { color: colors.mutedForeground }]}>{sublabel}</Text>
        )}
      </View>
      {rightElement ?? (
        onPress ? <Feather name="chevron-right" size={18} color={colors.mutedForeground} /> : null
      )}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: topPad + 16,
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 100),
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>Profile</Text>

      {/* Avatar */}
      <View style={styles.profileSection}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>SP</Text>
        </View>
        <Text style={[styles.profileName, { color: colors.foreground }]}>sadapay User</Text>
        <Text style={[styles.profilePhone, { color: colors.mutedForeground }]}>+93 700 000 000</Text>
        <View style={[styles.verifiedBadge, { backgroundColor: colors.accent }]}>
          <Feather name="check-circle" size={13} color={colors.primary} />
          <Text style={[styles.verifiedText, { color: colors.primary }]}>Verified Account</Text>
        </View>
      </View>

      {/* Account Info */}
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>ACCOUNT</Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <SettingRow
          icon="user"
          label="Personal Information"
          sublabel="Name, phone, email"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
        <SettingRow
          icon="credit-card"
          label="Payment Methods"
          sublabel="Bank accounts & cards"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
        <SettingRow
          icon="shield"
          label="KYC Verification"
          sublabel="Identity verified"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
      </View>

      {/* Security */}
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>SECURITY</Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <SettingRow
          icon="bell"
          label="Push Notifications"
          rightElement={
            <Switch
              value={notifications}
              onValueChange={(v) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setNotifications(v);
              }}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          }
        />
        <SettingRow
          icon="cpu"
          label="Biometric Login"
          rightElement={
            <Switch
              value={biometric}
              onValueChange={(v) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setBiometric(v);
              }}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          }
        />
        <SettingRow
          icon="lock"
          label="Change PIN"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
      </View>

      {/* Support */}
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>SUPPORT</Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <SettingRow
          icon="help-circle"
          label="Help Center"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
        <SettingRow
          icon="message-circle"
          label="Contact Support"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
        <SettingRow
          icon="file-text"
          label="Terms & Privacy"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
      </View>

      {/* Sign Out */}
      <Pressable
        style={({ pressed }) => [
          styles.signOutBtn,
          { backgroundColor: colors.card, opacity: pressed ? 0.8 : 1 },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel" },
            { text: "Sign Out", style: "destructive" },
          ]);
        }}
      >
        <Feather name="log-out" size={18} color={colors.destructive} />
        <Text style={[styles.signOutText, { color: colors.destructive }]}>Sign Out</Text>
      </Pressable>

      <Text style={[styles.version, { color: colors.mutedForeground }]}>sadapay.af v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20 },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    marginBottom: 24,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 32,
    gap: 6,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  avatarText: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
  },
  profileName: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  profilePhone: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 20,
  },
  card: {
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowInfo: { flex: 1 },
  rowLabel: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  rowSublabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 10,
  },
  signOutText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 16,
  },
});
