import { AppShell } from "@/components/app/AppShell";

export default function AgentsLayout({ children }: LayoutProps<"/agents">) {
  return <AppShell>{children}</AppShell>;
}
