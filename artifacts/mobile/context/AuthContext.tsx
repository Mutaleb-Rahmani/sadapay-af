import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface UserProfile {
  name: string;
  phone: string;
  pin: string;
  createdAt: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  register: (name: string, phone: string, pin: string) => Promise<void>;
  login: (phone: string, pin: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const KEY_USER = "@sadapay_user";
const KEY_SESSION = "@sadapay_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [savedUser, savedSession] = await Promise.all([
          AsyncStorage.getItem(KEY_USER),
          AsyncStorage.getItem(KEY_SESSION),
        ]);
        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedSession === "active") setIsLoggedIn(true);
      } catch (_) {}
      setIsLoading(false);
    };
    init();
  }, []);

  const register = useCallback(async (name: string, phone: string, pin: string) => {
    const profile: UserProfile = { name, phone, pin, createdAt: new Date().toISOString() };
    await AsyncStorage.setItem(KEY_USER, JSON.stringify(profile));
    await AsyncStorage.setItem(KEY_SESSION, "active");
    setUser(profile);
    setIsLoggedIn(true);
  }, []);

  const login = useCallback(async (phone: string, pin: string): Promise<boolean> => {
    if (!user) return false;
    if (user.phone === phone && user.pin === pin) {
      await AsyncStorage.setItem(KEY_SESSION, "active");
      setIsLoggedIn(true);
      return true;
    }
    return false;
  }, [user]);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(KEY_SESSION);
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
