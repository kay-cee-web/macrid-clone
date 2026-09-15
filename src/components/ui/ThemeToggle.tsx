"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  applyThemePreference,
  readThemePreference,
  saveThemePreference,
  subscribeToTheme,
  type ThemePreference,
} from "@/lib/theme";

const OPTIONS: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: "system", label: "System theme", Icon: Monitor },
  { value: "light", label: "Light theme", Icon: Sun },
  { value: "dark", label: "Dark theme", Icon: Moon },
];

const serverSnapshot = (): ThemePreference => "system";

export function ThemeToggle({ className }: { className?: string }) {
  const preference = useSyncExternalStore(subscribeToTheme, readThemePreference, serverSnapshot);

  // React's dev remount clears <html> attributes the boot script set; put it back.
  useLayoutEffect(() => {
    applyThemePreference(readThemePreference());
  }, []);

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={cn("inline-flex rounded-[10px] border border-line bg-surface p-0.5", className)}
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = preference === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => saveThemePreference(value)}
            className={cn(
              "grid size-7 place-items-center rounded-[8px] transition-colors [&_svg]:size-3.5",
              active ? "bg-raised text-ink ring-1 ring-inset ring-line" : "text-faint hover:text-ink",
            )}
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
}
