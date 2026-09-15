import type { Metadata } from "next";
import { UserMenu } from "@/components/app/UserMenu";
import { Card, Eyebrow } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { WorkingTrace } from "@/components/ui/WorkingTrace";

export const metadata: Metadata = { title: "Agents" };

/** Temporary landing so sign-in can be tested end to end. The Agents home replaces it. */
export default function AgentsPage() {
  return (
    <div className="min-h-dvh">
      <header className="flex items-center justify-between gap-4 border-b border-line bg-surface px-4 py-3 sm:px-6">
        <Logo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>
      <main className="mx-auto grid max-w-2xl gap-6 px-4 py-16">
        <Eyebrow>You&apos;re signed in</Eyebrow>
        <h1 className="text-[36px] font-semibold leading-tight">The Agents home is next.</h1>
        <Card className="grid gap-3">
          <p className="text-muted">
            Sign-in, registration, email verification and password reset are all connected to the
            Macrid API. The agent screens get built here next.
          </p>
          <WorkingTrace label="Building the Agents home" />
        </Card>
      </main>
    </div>
  );
}
