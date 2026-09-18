import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountSettings } from "@/components/app/AccountSettings";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <Suspense>
      <AccountSettings />
    </Suspense>
  );
}
