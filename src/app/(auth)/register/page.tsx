import type { Metadata } from "next";
import { AuthGate } from "@/components/auth/AuthGate";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <AuthGate mode="guest">
      <RegisterForm />
    </AuthGate>
  );
}
