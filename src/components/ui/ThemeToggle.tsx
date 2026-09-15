"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  applyThemePreference,
  readThemePreference,
  saveThemePreference,
  subscribeToTheme,
  type ThemePreference,
} from "@/lib/theme";
import { SegmentedControl, type SegmentOption } from "./SegmentedControl";

const OPTIONS: SegmentOption<ThemePreference>[] = [
  { value: "system", label: "System theme", icon: <Monitor />, iconOnly: true },
  { value: "light", label: "Light theme", icon: <Sun />, iconOnly: true },
  { value: "dark", label: "Dark theme", icon: <Moon />, iconOnly: true },
];

const serverSnapshot = (): ThemePreference => "system";

export function ThemeToggle({ className }: { className?: string }) {
  const preference = useSyncExternalStore(subscribeToTheme, readThemePreference, serverSnapshot);

  // React's dev remount clears <html> attributes the boot script set; put it back.
  useLayoutEffect(() => {
    applyThemePreference(readThemePreference());
  }, []);

  return (
    <SegmentedControl
      label="Theme"
      value={preference}
      options={OPTIONS}
      onChange={saveThemePreference}
      className={className}
    />
  );
}
