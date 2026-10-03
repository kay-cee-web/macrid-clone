import type { Metadata } from "next";
import { AuthGate } from "@/components/auth/AuthGate";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Create your free account",
  description: "Create a free Dexisphere Agents account and hand your first task to an AI agent. It finds leads, runs outreach and keeps your CRM up to date.",
  path: "/register",
  index: true,
});

export default function RegisterPage() {
  return (
    <AuthGate mode="guest">
      <RegisterForm />
    </AuthGate>
  );
}
