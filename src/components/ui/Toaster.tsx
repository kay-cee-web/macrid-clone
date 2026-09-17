"use client";

import { Toaster as SonnerToaster } from "sonner";

/**
 * Sonner, styled from our tokens so it follows light/dark automatically.
 * Call `toast.success(...)`, `toast.error(...)` etc. from `sonner` anywhere.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      closeButton
      gap={8}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-[12px] !border !border-line !bg-surface !text-ink !shadow-float !font-sans !text-sm",
          description: "!text-muted",
          closeButton: "!border-line !bg-surface !text-muted hover:!text-ink",
          actionButton: "!bg-accent !text-accent-ink",
          cancelButton: "!bg-raised !text-muted",
          success: "[&_[data-icon]]:!text-good",
          error: "[&_[data-icon]]:!text-bad",
          warning: "[&_[data-icon]]:!text-warn",
          info: "[&_[data-icon]]:!text-accent",
        },
      }}
    />
  );
}
