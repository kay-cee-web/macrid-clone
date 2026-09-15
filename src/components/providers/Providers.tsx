"use client";

import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/Toaster";
import { AuthProvider } from "./AuthProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
}
