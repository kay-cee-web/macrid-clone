import { AppShell } from "@/components/app/AppShell";
import { AuthGate } from "@/components/auth/AuthGate";

/** Every signed-in section (agents, records) shares one shell, so the sidebar persists. */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <AuthGate mode="user">
      <AppShell>{children}</AppShell>
    </AuthGate>
  );
}
