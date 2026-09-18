"use client";

import type { ReactNode } from "react";
import { SettingRow } from "@/components/settings/SettingsSection";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/** Title and sub-line at the top of a settings panel. */
export function PanelHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="grid gap-1 pr-10">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="max-w-[62ch] text-sm text-muted">{description}</p>
    </div>
  );
}

/** Rows divided by hairlines, the way the agent settings pages read. */
export function Rows({ children }: { children: ReactNode }) {
  return <div className="-mx-4 divide-y divide-line">{children}</div>;
}

export function AppearancePanel() {
  return (
    <div className="grid gap-6">
      <PanelHeading title="Appearance" description="Applies to this browser, on this device." />
      <Rows>
        <SettingRow label="Theme" description="System follows your device; light and dark stay put.">
          <ThemeToggle />
        </SettingRow>
      </Rows>
    </div>
  );
}
