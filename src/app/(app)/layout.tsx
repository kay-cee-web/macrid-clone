import { AuthGate } from "@/components/auth/AuthGate";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return <AuthGate mode="user">{children}</AuthGate>;
}
