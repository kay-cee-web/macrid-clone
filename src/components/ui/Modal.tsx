"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { IconButton } from "./IconButton";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
};

const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-3xl" };

/** Native <dialog>: focus trapping, Escape and top-layer stacking come free. */
export function Modal({ open, onClose, title, description, footer, size = "md", children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={cn(
        "m-auto w-[calc(100%-32px)] rounded-[16px] border border-line bg-surface p-0 text-ink shadow-float",
        "backdrop:bg-black/40 backdrop:backdrop-blur-[2px] open:animate-fade-in",
        widths[size],
      )}
    >
      {open && (
        <div className="grid max-h-[85dvh] grid-rows-[auto_1fr_auto]">
          <header className="flex items-start gap-3 border-b border-line px-5 py-4">
            <div className="grid flex-1 gap-1">
              <h2 id={titleId} className="text-[17px] font-semibold">
                {title}
              </h2>
              {description && <p className="text-[13.5px] text-muted">{description}</p>}
            </div>
            <IconButton label="Close" onClick={onClose}>
              <X />
            </IconButton>
          </header>
          <div className="overflow-y-auto px-5 py-4">{children}</div>
          {footer && (
            <footer className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-3">
              {footer}
            </footer>
          )}
        </div>
      )}
    </dialog>
  );
}
