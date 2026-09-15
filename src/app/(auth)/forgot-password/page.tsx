import type { Metadata } from "next";
import { AuthGate } from "@/components/auth/AuthGate";
import { ForgotPasswordFlow } from "@/components/auth/ForgotPasswordFlow";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <AuthGate mode="guest">
      <ForgotPasswordFlow />
    </AuthGate>
  );
}
