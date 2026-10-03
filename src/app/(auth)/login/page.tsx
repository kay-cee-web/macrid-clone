import type { Metadata } from "next";
import { AuthGate } from "@/components/auth/AuthGate";
import { LoginForm } from "@/components/auth/LoginForm";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Sign in to your AI agents",
  description: "Sign in to Dexisphere Agents to see what your AI agents did: leads found, outreach sent and CRM records updated, with a receipt for every change.",
  path: "/login",
  index: true,
});

export default function LoginPage() {
  return (
    <AuthGate mode="guest">
      <LoginForm />
    </AuthGate>
  );
}
