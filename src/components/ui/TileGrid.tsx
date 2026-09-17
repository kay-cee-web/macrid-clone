import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Airy 1 → 2 (sm) → 3 (xl) column grid for tiles that carry their own cover art. */
export function TileGrid({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3", className)}>{children}</div>;
}
