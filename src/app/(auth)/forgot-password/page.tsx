import type { Metadata } from "next";
import { AuthGate } from "@/components/auth/AuthGate";
import { ForgotPasswordFlow } from "@/components/auth/ForgotPasswordFlow";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Reset password",
  description: "Get a link to reset the password for your Dexisphere Agents account.",
  path: "/forgot-password",
});

export default function ForgotPasswordPage() {
  return (
    <AuthGate mode="guest">
      <ForgotPasswordFlow />
    </AuthGate>
  );
}
