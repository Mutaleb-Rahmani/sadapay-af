import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWallet } from "@/context/WalletContext";
import { useColors } from "@/hooks/useColors";

const CONTACTS = [
  { id: "c1", name: "Ahmad Karimi", phone: "+93 700 111 222" },
  { id: "c2", name: "Fatima Rahimi", phone: "+93 700 333 444" },
  { id: "c3", name: "Yusuf Ahmadi", phone: "+93 700 555 666" },
  { id: "c4", name: "Mariam Sultani", phone: "+93 700 777 888" },
];

export default function SendScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { balance, sendMoney } = useWallet();
  const params = useLocalSearchParams<{ recipient?: string }>();
  const [recipient, setRecipient] = useState(params.recipient ?? "");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (params.recipient) {
      setRecipient(params.recipient);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [params.recipient]);

  const numericAmount = parseFloat(amount) || 0;
  const isValid = recipient.trim().length > 0 && numericAmount > 0 && numericAmount <= balance;

  const handleSend = async () => {
    if (!isValid) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSending(true);
    try {
      await sendMoney(numericAmount, recipient.trim(), note.trim() || "Transfer");
      Alert.alert("Success", `AFN ${numericAmount.toLocaleString()} sent to ${recipient}`, [
        { text: "Done", onPress: () => router.back() },
      ]);
    } catch (_) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Send Money</Text>
        <Pressable
          style={[styles.scanBtn, { backgroundColor: colors.accent }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/scan");
          }}
        >
          <Feather name="maximize" size={18} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.body}>
        {/* Balance banner */}
        <View style={[styles.balanceBanner, { backgroundColor: colors.accent }]}>
          <Feather name="info" size={14} color={colors.primary} />
          <Text style={[styles.balanceText, { color: colors.primary }]}>
            Available: AFN {balance.toLocaleString()}
          </Text>
        </View>

        {/* Amount */}
        <View style={styles.amountSection}>
          <Text style={[styles.amountCurrency, { color: colors.mutedForeground }]}>AFN</Text>
          <TextInput
            style={[styles.amountInput, { color: colors.foreground }]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor={colors.border}
          />
        </View>

        {/* Recipient */}
        <Text style={[styles.label, { color: colors.mutedForeground }]}>To</Text>
        <View style={[styles.inputBox, { backgroundColor: colors.card, borderColor: recipient.startsWith("SADA-AF-") ? colors.primary : colors.border }]}>
          <Feather
            name={recipient.startsWith("SADA-AF-") ? "check-circle" : "user"}
            size={18}
            color={recipient.startsWith("SADA-AF-") ? colors.primary : colors.mutedForeground}
          />
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            value={recipient}
            onChangeText={setRecipient}
            placeholder="Name, phone, or scan QR code"
            placeholderTextColor={colors.mutedForeground}
          />
          {recipient.length > 0 && (
            <Pressable onPress={() => setRecipient("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        {/* Scanned badge */}
        {recipient.startsWith("SADA-AF-") && (
          <View style={[styles.scannedBadge, { backgroundColor: colors.accent }]}>
            <Feather name="maximize" size={13} color={colors.primary} />
            <Text style={[styles.scannedText, { color: colors.primary }]}>
              Wallet ID scanned successfully
            </Text>
          </View>
        )}

        {/* Quick contacts */}
        <View style={styles.contacts}>
          {CONTACTS.map((c) => (
            <Pressable
              key={c.id}
              style={({ pressed }) => [
                styles.contactChip,
                {
                  backgroundColor: recipient === c.name ? colors.primary : colors.card,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setRecipient(c.name);
              }}
            >
              <View style={[styles.contactAvatar, { backgroundColor: recipient === c.name ? "rgba(255,255,255,0.25)" : colors.accent }]}>
                <Text style={[styles.contactInitial, { color: recipient === c.name ? "#FFFFFF" : colors.primary }]}>
                  {c.name[0]}
                </Text>
              </View>
              <Text style={[styles.contactName, { color: recipient === c.name ? "#FFFFFF" : colors.foreground }]} numberOfLines={1}>
                {c.name.split(" ")[0]}
              </Text>
            </Pressable>
          ))}
          {/* Scan QR chip */}
          <Pressable
            style={({ pressed }) => [
              styles.contactChip,
              { backgroundColor: colors.card, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/scan");
            }}
          >
            <View style={[styles.contactAvatar, { backgroundColor: colors.accent }]}>
              <Feather name="maximize" size={18} color={colors.primary} />
            </View>
            <Text style={[styles.contactName, { color: colors.foreground }]}>Scan QR</Text>
          </Pressable>
        </View>

        {/* Note */}
        <Text style={[styles.label, { color: colors.mutedForeground }]}>Note (optional)</Text>
        <View style={[styles.inputBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="edit-3" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            value={note}
            onChangeText={setNote}
            placeholder="What's it for?"
            placeholderTextColor={colors.mutedForeground}
          />
        </View>

        {/* Send button */}
        <Pressable
          style={({ pressed }) => [
            styles.sendBtn,
            {
              backgroundColor: isValid ? colors.primary : colors.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          onPress={handleSend}
          disabled={!isValid || sending}
        >
          <Feather name="send" size={20} color={isValid ? "#FFFFFF" : colors.mutedForeground} />
          <Text style={[styles.sendBtnText, { color: isValid ? "#FFFFFF" : colors.mutedForeground }]}>
            {sending ? "Sending..." : "Send Money"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
  headerTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  scanBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
  balanceBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 24,
  },
  balanceText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  amountSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 32,
  },
  amountCurrency: { fontSize: 28, fontFamily: "Inter_500Medium" },
  amountInput: {
    fontSize: 52,
    fontFamily: "Inter_700Bold",
    minWidth: 80,
    textAlign: "center",
  },
  label: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
    marginBottom: 8,
  },
  input: { flex: 1, fontSize: 16, fontFamily: "Inter_400Regular" },
  scannedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  scannedText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  contacts: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  contactChip: {
    alignItems: "center",
    borderRadius: 14,
    padding: 10,
    gap: 6,
    minWidth: 68,
  },
  contactAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  contactInitial: { fontSize: 15, fontFamily: "Inter_700Bold" },
  contactName: { fontSize: 12, fontFamily: "Inter_500Medium" },
  sendBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingVertical: 18,
    gap: 10,
    marginTop: 8,
  },
  sendBtnText: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
});
