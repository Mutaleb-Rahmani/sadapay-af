import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Transaction } from "@/context/WalletContext";
import { useColors } from "@/hooks/useColors";

interface Props {
  transaction: Transaction;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const hours = diff / (1000 * 60 * 60);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${Math.floor(hours)}h ago`;
  if (hours < 48) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatAmount(amount: number) {
  return amount.toLocaleString("en-US");
}

function getIconConfig(type: Transaction["type"]): { icon: string; bg: string; color: string } {
  switch (type) {
    case "send":
      return { icon: "arrow-up-right", bg: "#FFF1F0", color: "#EF4444" };
    case "receive":
      return { icon: "arrow-down-left", bg: "#F0FAF5", color: "#00C896" };
    case "payment":
      return { icon: "shopping-bag", bg: "#F5F0FF", color: "#8B5CF6" };
    case "topup":
      return { icon: "plus-circle", bg: "#F0F9FF", color: "#0EA5E9" };
    default:
      return { icon: "circle", bg: "#F5F7FA", color: "#6B7280" };
  }
}

export default function TransactionItem({ transaction }: Props) {
  const colors = useColors();
  const { icon, bg, color } = getIconConfig(transaction.type);
  const isDebit = transaction.type === "send" || transaction.type === "payment";
  const counterparty =
    transaction.recipient || transaction.sender || "sadapay.af";

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: bg }]}>
        <Feather name={icon as any} size={18} color={color} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.description, { color: colors.foreground }]} numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text style={[styles.counterparty, { color: colors.mutedForeground }]} numberOfLines={1}>
          {counterparty} · {formatDate(transaction.date)}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: isDebit ? colors.destructive : colors.primary }]}>
          {isDebit ? "-" : "+"}AFN {formatAmount(transaction.amount)}
        </Text>
        {transaction.status === "pending" && (
          <Text style={[styles.status, { color: colors.mutedForeground }]}>Pending</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 3,
  },
  description: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  counterparty: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  right: {
    alignItems: "flex-end",
    gap: 2,
  },
  amount: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  status: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
});
