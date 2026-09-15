"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Menu as MenuIcon, X } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";
import { AppSidebar } from "./AppSidebar";

/**
 * Fixed sidebar on large screens; a slide-in drawer below that.
 * <main> is the scroll container, so full-height views (the chat) can use h-full.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const close = () => setDrawerOpen(false);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setDrawerOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  return (
    <div className="flex h-dvh flex-col lg:grid lg:grid-cols-[252px_minmax(0,1fr)]">
      <aside className="hidden h-dvh border-r border-line bg-surface lg:block">
        <AppSidebar />
      </aside>

      <header className="flex shrink-0 items-center gap-3 border-b border-line bg-surface px-4 py-2.5 lg:hidden">
        <IconButton label="Open navigation" onClick={() => setDrawerOpen(true)}>
          <MenuIcon />
        </IconButton>
        <Logo />
      </header>

      <div
        aria-hidden
        onClick={close}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden",
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        aria-label="Navigation"
        inert={!drawerOpen}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] border-r border-line bg-surface shadow-float",
          "transition-transform duration-200 lg:hidden",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <IconButton label="Close navigation" onClick={close} className="absolute right-3 top-4">
          <X />
        </IconButton>
        <AppSidebar onNavigate={close} />
      </aside>

      <main id="app-main" className="min-h-0 min-w-0 flex-1 overflow-y-auto lg:h-dvh">
        {children}
      </main>
    </div>
  );
}
