import type { Metadata } from "next";
import { AppShell } from "@/components/app/AppShell";
import { AuthGate } from "@/components/auth/AuthGate";
import { NOINDEX } from "@/lib/seo/site";

/** Everything signed-in stays out of search, including routes that set no metadata of their own. Home opts back in. */
export const metadata: Metadata = { robots: NOINDEX };

/** Every signed-in section (agents, records) shares one shell, so the sidebar persists. */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <AuthGate mode="user">
      <AppShell>{children}</AppShell>
    </AuthGate>
  );
}
