"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  applyThemePreference,
  readThemePreference,
  saveThemePreference,
  subscribeToTheme,
  THEME_PREFERENCES,
  type ThemePreference,
} from "@/lib/theme";
import { cn } from "@/lib/cn";

const ICONS: Record<ThemePreference, typeof Sun> = { system: Monitor, light: Sun, dark: Moon };
const serverSnapshot = (): ThemePreference => "system";

/** One round icon button that steps through system → light → dark. */
export function ThemeCycleButton({ className }: { className?: string }) {
  const preference = useSyncExternalStore(subscribeToTheme, readThemePreference, serverSnapshot);
  const next = THEME_PREFERENCES[(THEME_PREFERENCES.indexOf(preference) + 1) % THEME_PREFERENCES.length];
  const Icon = ICONS[preference];

  // React's dev remount clears <html> attributes the boot script set; put it back.
  useLayoutEffect(() => {
    applyThemePreference(readThemePreference());
  }, []);

  const label = `Theme: ${preference}. Switch to ${next}`;
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => saveThemePreference(next)}
      className={cn(
        "inline-grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-raised hover:text-ink",
        className,
      )}
    >
      <Icon className="size-4.5" />
    </button>
  );
}
