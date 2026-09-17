import Link from "next/link";
import { AuthShowcase } from "@/components/auth/AuthShowcase";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex flex-col px-4 py-6 sm:px-10">
        <header className="flex items-center justify-between gap-4">
          <Link href="/login" aria-label="Dexisphere Agents home">
            <Logo />
          </Link>
          <ThemeToggle />
        </header>
        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[400px]">{children}</div>
        </main>
        <footer className="text-xs text-faint">
          © {new Date().getFullYear()} Dexisphere
        </footer>
      </div>
      <AuthShowcase />
    </div>
  );
}
