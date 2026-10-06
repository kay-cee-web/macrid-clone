import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthBackdrop } from "@/components/auth/AuthBackdrop";
import { AuthShowcase } from "@/components/auth/AuthShowcase";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { dexisphereSiteLink } from "@/lib/config";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative isolate grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <AuthBackdrop />
      <AuthShowcase />
      {/* Frosted glass over the artwork, as on Tapotik's form side: the colour shows, the grid blurs out. */}
      <div className="flex flex-col bg-ground/60 px-4 py-5 backdrop-blur-2xl sm:px-10">
        <header className="flex h-10 shrink-0 items-center justify-between gap-4">
          {/* The logo lives on the artwork, which is hidden on small screens. */}
          <Link href="/login" aria-label="Dexisphere Agents" className="lg:hidden">
            <Logo />
          </Link>
          <a
            href={dexisphereSiteLink("/")}
            className="hidden items-center gap-2 text-sm text-muted transition-colors hover:text-ink lg:inline-flex"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </a>
          <ThemeToggle />
        </header>
        <main className="flex flex-1 items-center justify-center py-6">
          <div className="grid w-full max-w-[450px] gap-5">{children}</div>
        </main>
      </div>
    </div>
  );
}
