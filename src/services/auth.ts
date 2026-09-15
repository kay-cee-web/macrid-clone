import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { readToken } from "@/lib/auth/session";
import type { LoginInput, RegisterInput, User } from "@/types/auth";

/** Every call throws on failure; callers turn errors into UI with extractApiError. */

async function tokenFrom(request: Promise<{ data: unknown }>, fallback: string) {
  const { data } = await request;
  assertEnvelope(data, fallback);
  const token = readToken(data);
  if (!token) throw new Error(`${fallback}: no token came back.`);
  return token;
}

export const login = (input: LoginInput) =>
  tokenFrom(api.post("/login", input), "Could not sign in");

export function register(input: RegisterInput) {
  const body: RegisterInput = { ...input };
  if (!body.licensecode?.trim()) delete body.licensecode;
  return tokenFrom(api.post("/register", body), "Could not create your account");
}

export async function fetchUser(): Promise<User> {
  const { data } = await api.get("/user");
  assertEnvelope(data, "Could not load your account");
  return (data?.user ?? data?.data ?? data) as User;
}

/** Best effort: the local session is cleared whether or not this succeeds. */
export async function logout() {
  await api.post("/logout").catch(() => undefined);
}

/* ── Email verification ─────────────────────────────────────────────────── */

export async function verifyEmail(input: { email: string; code: string; userId: number }) {
  const { data } = await api.post("/update-verification-code", {
    email: input.email,
    code: input.code,
    user_id: input.userId,
  });
  return assertEnvelope(data, "Could not verify your email");
}

export async function resendVerification(email: string) {
  const { data } = await api.post("/resend-verification-email", { email });
  return assertEnvelope(data, "Could not send a new code");
}

/* ── Password reset ─────────────────────────────────────────────────────── */

export async function requestPasswordReset(email: string) {
  const { data } = await api.post("/forgot-password", { email });
  return assertEnvelope(data, "Could not send a reset code");
}

export async function verifyResetCode(email: string, code: string) {
  const { data } = await api.post("/verify-reset-code", { email, code });
  return assertEnvelope(data, "That code didn't work");
}

export async function resetPassword(input: { email: string; code: string; password: string }) {
  const { data } = await api.post("/reset-password", {
    email: input.email,
    code: input.code,
    password: input.password,
    password_confirmation: input.password,
  });
  return assertEnvelope(data, "Could not reset your password");
}
