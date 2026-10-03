import type { Metadata } from "next";
import { AuthGate } from "@/components/auth/AuthGate";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Verify email",
  description: "Confirm your email address to start using Dexisphere Agents.",
  path: "/email-verify",
});

export default function EmailVerifyPage() {
  return (
    <AuthGate mode="unverified">
      <VerifyEmailForm />
    </AuthGate>
  );
}
