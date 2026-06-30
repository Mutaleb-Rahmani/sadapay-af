import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const MY_PHONE = "+93 700 000 000";
const MY_WALLET_ID = "SADA-AF-2024-7800";

function QRGrid() {
  const colors = useColors();
  const size = 200;
  const cellCount = 25;
  const cellSize = size / cellCount;

  const pattern = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,0,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,0,1,0,1,1,0,1,0,1,1,0,1],
    [0,1,0,1,1,0,0,0,1,0,0,1,0,1,1,0,1,0,0,1,0],
    [1,0,1,0,1,0,1,0,0,1,1,0,1,0,0,1,0,1,1,0,1],
    [0,0,1,1,0,0,0,0,1,0,1,0,1,1,0,0,1,0,1,0,0],
    [1,1,0,0,1,0,1,1,0,1,0,1,0,0,1,1,0,1,0,1,1],
    [0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,1,0,0,0],
    [1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,0,0,1,0,1,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,1,0,0,1,0,0,1,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,0,1,1,0,0],
    [1,0,1,1,1,0,1,0,0,0,1,0,1,0,0,1,0,0,1,0,1],
    [1,0,0,0,0,0,1,0,1,1,0,0,0,1,0,0,1,0,0,0,0],
    [1,1,1,1,1,1,1,0,0,0,1,0,0,0,1,1,0,1,1,1,1],
  ];

  return (
    <View style={{ width: size, height: size }}>
      {pattern.map((row, ri) => (
        <View key={ri} style={{ flexDirection: "row" }}>
          {row.map((cell, ci) => (
            <View
              key={ci}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: cell ? colors.foreground : "transparent",
                borderRadius: cell ? 1 : 0,
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

export default function ReceiveScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await Clipboard.setStringAsync(MY_WALLET_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 16, borderBottomColor: colors.border },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Receive Money</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.body}>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Share your QR code or wallet ID to receive payments
        </Text>

        {/* QR Card */}
        <View style={[styles.qrCard, { backgroundColor: colors.card }]}>
          <View style={[styles.qrContainer, { backgroundColor: colors.background }]}>
            <QRGrid />
          </View>
          <View style={styles.qrInfo}>
            <Text style={[styles.userName, { color: colors.foreground }]}>sadapay User</Text>
            <Text style={[styles.userPhone, { color: colors.mutedForeground }]}>{MY_PHONE}</Text>
          </View>
        </View>

        {/* Wallet ID */}
        <View style={[styles.idBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View>
            <Text style={[styles.idLabel, { color: colors.mutedForeground }]}>Wallet ID</Text>
            <Text style={[styles.idValue, { color: colors.foreground }]}>{MY_WALLET_ID}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.copyBtn,
              {
                backgroundColor: copied ? colors.primary : colors.accent,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            onPress={handleCopy}
          >
            <Feather
              name={copied ? "check" : "copy"}
              size={16}
              color={copied ? "#FFFFFF" : colors.primary}
            />
            <Text style={[styles.copyText, { color: copied ? "#FFFFFF" : colors.primary }]}>
              {copied ? "Copied!" : "Copy"}
            </Text>
          </Pressable>
        </View>

        {/* Info */}
        <View style={[styles.infoBox, { backgroundColor: colors.accent }]}>
          <Feather name="shield" size={16} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.primary }]}>
            Only share your QR code or wallet ID with trusted people
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 40, alignItems: "flex-start" },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginBottom: 28,
    paddingHorizontal: 16,
  },
  qrCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    gap: 20,
    width: "100%",
    maxWidth: 320,
    marginBottom: 16,
  },
  qrContainer: {
    padding: 16,
    borderRadius: 16,
  },
  qrInfo: {
    alignItems: "center",
    gap: 4,
  },
  userName: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  userPhone: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  idBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: "100%",
    marginBottom: 16,
  },
  idLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    marginBottom: 2,
  },
  idValue: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  copyText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    width: "100%",
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
});
