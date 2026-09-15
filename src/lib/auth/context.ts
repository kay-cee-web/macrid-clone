"use client";

import { createContext } from "react";
import type { AuthStatus, User } from "@/types/auth";

export type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  /** Stores the token and loads the user. AuthGate handles where to go next. */
  signIn: (token: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
