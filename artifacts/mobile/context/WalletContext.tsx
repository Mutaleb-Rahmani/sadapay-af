import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export type TransactionType = "send" | "receive" | "payment" | "topup";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  recipient?: string;
  sender?: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

interface WalletContextValue {
  balance: number;
  transactions: Transaction[];
  sendMoney: (amount: number, recipient: string, note: string) => Promise<void>;
  receiveMoney: (amount: number, sender: string) => Promise<void>;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextValue | null>(null);

const STORAGE_KEY_BALANCE = "@sadapay_balance";
const STORAGE_KEY_TRANSACTIONS = "@sadapay_transactions";

const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    type: "receive",
    amount: 5000,
    currency: "AFN",
    description: "Payment received",
    sender: "Ahmad Karimi",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: "completed",
  },
  {
    id: "t2",
    type: "send",
    amount: 1200,
    currency: "AFN",
    description: "Electricity bill",
    recipient: "DABS Power Co.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: "completed",
  },
  {
    id: "t3",
    type: "topup",
    amount: 10000,
    currency: "AFN",
    description: "Wallet top-up",
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: "completed",
  },
  {
    id: "t4",
    type: "payment",
    amount: 750,
    currency: "AFN",
    description: "Grocery - Kabul Market",
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    status: "completed",
  },
  {
    id: "t5",
    type: "send",
    amount: 3000,
    currency: "AFN",
    description: "Rent split",
    recipient: "Fatima Rahimi",
    date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    status: "completed",
  },
  {
    id: "t6",
    type: "receive",
    amount: 2500,
    currency: "AFN",
    description: "Freelance payment",
    sender: "Tech Solutions",
    date: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    status: "completed",
  },
];

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(18340);
  const [transactions, setTransactions] = useState<Transaction[]>(DEFAULT_TRANSACTIONS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [savedBalance, savedTxns] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_BALANCE),
          AsyncStorage.getItem(STORAGE_KEY_TRANSACTIONS),
        ]);
        if (savedBalance !== null) setBalance(Number(savedBalance));
        if (savedTxns !== null) setTransactions(JSON.parse(savedTxns));
      } catch (_) {}
      setIsLoading(false);
    };
    load();
  }, []);

  const persist = useCallback(async (newBalance: number, newTxns: Transaction[]) => {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEY_BALANCE, String(newBalance)),
      AsyncStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(newTxns)),
    ]);
  }, []);

  const sendMoney = useCallback(async (amount: number, recipient: string, note: string) => {
    const newBalance = balance - amount;
    const tx: Transaction = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
      type: "send",
      amount,
      currency: "AFN",
      description: note || "Transfer",
      recipient,
      date: new Date().toISOString(),
      status: "completed",
    };
    const newTxns = [tx, ...transactions];
    setBalance(newBalance);
    setTransactions(newTxns);
    await persist(newBalance, newTxns);
  }, [balance, transactions, persist]);

  const receiveMoney = useCallback(async (amount: number, sender: string) => {
    const newBalance = balance + amount;
    const tx: Transaction = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
      type: "receive",
      amount,
      currency: "AFN",
      description: "Money received",
      sender,
      date: new Date().toISOString(),
      status: "completed",
    };
    const newTxns = [tx, ...transactions];
    setBalance(newBalance);
    setTransactions(newTxns);
    await persist(newBalance, newTxns);
  }, [balance, transactions, persist]);

  return (
    <WalletContext.Provider value={{ balance, transactions, sendMoney, receiveMoney, isLoading }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}
