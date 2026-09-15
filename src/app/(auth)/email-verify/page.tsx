import type { Metadata } from "next";
import { AuthGate } from "@/components/auth/AuthGate";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";

export const metadata: Metadata = { title: "Verify email" };

export default function EmailVerifyPage() {
  return (
    <AuthGate mode="unverified">
      <VerifyEmailForm />
    </AuthGate>
  );
}
