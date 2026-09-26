import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type AlertTone = "bad" | "warn";

const tones: Record<AlertTone, string> = {
  bad: "bg-bad-soft text-bad",
  warn: "bg-warn-soft text-warn",
};

/**
 * What went wrong, in the page rather than only in a toast. Forms put one above
 * their fields: a native `<dialog>` sits in the top layer and can cover a toast,
 * so a message that only toasts can be missed entirely.
 */
export function Alert({
  tone = "bad",
  className,
  children,
}: {
  tone?: AlertTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <p role="alert" className={cn("rounded-xl px-3 py-2 text-sm", tones[tone], className)}>
      {children}
    </p>
  );
}
