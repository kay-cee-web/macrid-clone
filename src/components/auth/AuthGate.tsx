"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { rememberRedirect, takeRedirect } from "@/lib/auth/session";
import type { AuthStatus, User } from "@/types/auth";
import { FullScreenLoader } from "./FullScreenLoader";

/**
 * guest       login/register/forgot: signed-in users are sent on.
 * user        the app: guests go to /login, unverified users to /email-verify.
 * unverified  /email-verify: needs a session, and leaves once verified.
 */
export type GateMode = "guest" | "user" | "unverified";

function destination(mode: GateMode, status: AuthStatus, user: User | null): string | null {
  if (status === "loading") return null;
  const verified = Boolean(user?.email_verified_at);
  if (mode === "guest") {
    if (status !== "authenticated") return null;
    return verified ? "after-login" : "/email-verify";
  }
  if (status !== "authenticated") return "/login";
  if (mode === "user") return verified ? null : "/email-verify";
  return verified ? "after-login" : null;
}

export function AuthGate({ mode, children }: { mode: GateMode; children: ReactNode }) {
  const { status, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const redirecting = useRef<string | null>(null);
  const target = destination(mode, status, user);

  useEffect(() => {
    if (!target || redirecting.current === target) return;
    redirecting.current = target;
    if (target === "/login" && mode === "user") {
      rememberRedirect(pathname + window.location.search);
    }
    router.replace(target === "after-login" ? takeRedirect() : target);
  }, [target, mode, pathname, router]);

  if (status === "loading" || target) return <FullScreenLoader />;
  return <>{children}</>;
}
