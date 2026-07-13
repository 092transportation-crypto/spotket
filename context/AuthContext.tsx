"use client";

import type { User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

export type SavedAddress = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type AccountOrderItem = {
  name: string;
  variant?: string;
  quantity: number;
  price: number;
  /** Catalog product id, used by the admin dashboard for supplier links. */
  productId?: string;
};

export type AccountOrder = {
  id: string;
  date: string;
  items: AccountOrderItem[];
  total: number;
  address: SavedAddress | null;
  status: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: SavedAddress;
};

type ProfileUpdate = Partial<Pick<AuthUser, "name" | "phone" | "address">>;

type NewOrder = {
  items: AccountOrderItem[];
  total: number;
  address: SavedAddress;
};

type AuthContextValue = {
  user: AuthUser | null;
  orders: AccountOrder[];
  /** Resolves to an error/info message, or null on plain success. */
  signup: (name: string, email: string, password: string) => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  updateProfile: (update: ProfileUpdate) => Promise<void>;
  addOrder: (order: NewOrder) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthUser(user: User): AuthUser {
  const metadata = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email ?? "",
    name: (metadata.name as string) || user.email || "Customer",
    phone: metadata.phone as string | undefined,
    address: metadata.address as SavedAddress | undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [orders, setOrders] = useState<AccountOrder[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (data.session) setUser(toAuthUser(data.session.user));
    });
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session ? toAuthUser(session.user) : null);
        if (!session) setOrders([]);
      },
    );
    return () => subscription.subscription.unsubscribe();
  }, []);

  const loadOrders = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select("id, items, total, status, shipping_address, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to load orders:", error.message);
      return;
    }
    setOrders(
      (data ?? []).map((row) => ({
        id: row.id,
        date: row.created_at,
        items: row.items as AccountOrderItem[],
        total: Number(row.total),
        address: row.shipping_address as SavedAddress | null,
        status: row.status,
      })),
    );
  }, []);

  useEffect(() => {
    if (user) void loadOrders(user.id);
  }, [user?.id, loadOrders]); // eslint-disable-line react-hooks/exhaustive-deps

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<string | null> => {
    if (!name.trim()) return "Please enter your name";
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { name: name.trim() } },
    });
    if (error) return error.message;
    if (!data.session) {
      return "Almost there — check your email for a confirmation link, then sign in.";
    }
    return null;
  };

  const login = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    return error ? error.message : null;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (update: ProfileUpdate) => {
    if (!user) return;
    const { data, error } = await supabase.auth.updateUser({ data: update });
    if (error) {
      console.error("Failed to update profile:", error.message);
      return;
    }
    if (data.user) setUser(toAuthUser(data.user));
  };

  const addOrder = async (order: NewOrder) => {
    if (!user) return;
    const { error } = await supabase.from("orders").insert({
      user_id: user.id,
      items: order.items,
      total: order.total,
      status: "paid",
      shipping_address: order.address,
    });
    if (error) {
      console.error("Failed to save order:", error.message);
      return;
    }
    await loadOrders(user.id);
  };

  return (
    <AuthContext.Provider
      value={{ user, orders, signup, login, logout, updateProfile, addOrder }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
