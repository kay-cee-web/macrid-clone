import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthShowcase } from "@/components/auth/AuthShowcase";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { dexisphereSiteLink } from "@/lib/config";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <AuthShowcase />
      {/* Header and footer are the same height, so the card sits on the viewport's midline. */}
      <div className="flex flex-col px-4 py-6 sm:px-10">
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
        <main className="flex flex-1 items-center justify-center py-10">
          <div className="grid w-full max-w-[440px] gap-6">{children}</div>
        </main>
        <footer className="flex h-10 shrink-0 items-center justify-center text-xs text-faint">
          © {new Date().getFullYear()} Dexisphere
        </footer>
      </div>
    </div>
  );
}
