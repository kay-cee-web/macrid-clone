"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { AuthContext, type AuthContextValue } from "@/lib/auth/context";
import { emitAuthEvent, onAuthEvent } from "@/lib/auth/events";
import { extractApiError } from "@/lib/api/errors";
import { clearSession, getToken, rememberRedirect, setToken } from "@/lib/auth/session";
import * as authService from "@/services/auth";
import type { AuthStatus, User } from "@/types/auth";

type State = { status: AuthStatus; user: User | null };
const GUEST: State = { status: "guest", user: null };

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading", user: null });

  const refreshUser = useCallback(async () => {
    try {
      const user = await authService.fetchUser();
      setState({ status: "authenticated", user });
      return user;
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) clearSession();
      else toast.error(extractApiError(err, "Could not load your account"));
      setState(GUEST);
      return null;
    }
  }, []);

  // Restore the session saved in this browser.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!getToken()) {
        if (!cancelled) setState(GUEST);
        return;
      }
      await refreshUser();
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  const endSession = useCallback(() => {
    clearSession();
    emitAuthEvent("logout");
    setState(GUEST);
    router.replace("/login");
  }, [router]);

  // The API said the token is dead: remember where the user was, then sign out.
  useEffect(
    () =>
      onAuthEvent("unauthenticated", () => {
        rememberRedirect(window.location.pathname + window.location.search);
        toast.message("Your session ended. Sign in to pick up where you left off.");
        endSession();
      }),
    [endSession],
  );

  // Routing after sign-in is AuthGate's job, so there is exactly one redirect.
  const signIn = useCallback<AuthContextValue["signIn"]>(
    async (token) => {
      setToken(token);
      return refreshUser();
    },
    [refreshUser],
  );

  const signOut = useCallback(async () => {
    await authService.logout();
    endSession();
  }, [endSession]);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, signIn, signOut, refreshUser }),
    [state, signIn, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
