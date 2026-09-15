import type { Metadata } from "next";
import { AuthGate } from "@/components/auth/AuthGate";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthGate mode="guest">
      <LoginForm />
    </AuthGate>
  );
}
