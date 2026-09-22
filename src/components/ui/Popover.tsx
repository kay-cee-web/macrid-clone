"use client";

import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import { useDismiss } from "@/hooks/useDismiss";
import { cn } from "@/lib/cn";

type TriggerProps = { onClick: () => void; "aria-expanded": boolean; "aria-controls": string };

type PopoverProps = {
  /** Renders the trigger; spread `props` onto a button. */
  trigger: (props: TriggerProps) => ReactNode;
  /** The panel's accessible name. */
  label: string;
  children: ReactNode;
  side?: "top" | "bottom";
  /** "end" pins the panel's right edge to the trigger's, for triggers near a container's right side. */
  align?: "start" | "center" | "end";
  className?: string;
};

/**
 * A small panel that can hold controls. Pointer devices open it on hover (the
 * panel's padding bridges the gap, so the pointer can travel into it); a tap,
 * click or Enter on the trigger pins it open until a press outside or Escape.
 */
export function Popover({ trigger, label, children, side = "top", align = "center", className }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, rootRef, close);

  return (
    <div ref={rootRef} className={cn("group/pop relative inline-flex", className)}>
      {trigger({ onClick: () => setOpen((v) => !v), "aria-expanded": open, "aria-controls": id })}
      <div
        className={cn(
          "absolute z-30 w-max transition-[opacity,visibility] duration-150",
          side === "top" ? "bottom-full pb-2" : "top-full pt-2",
          align === "end" ? "right-0" : align === "start" ? "left-0" : "left-1/2 -translate-x-1/2",
          open
            ? "visible opacity-100"
            : "invisible opacity-0 can-hover:group-hover/pop:visible can-hover:group-hover/pop:opacity-100",
        )}
      >
        <div
          id={id}
          role="group"
          aria-label={label}
          className="max-w-72 rounded-[12px] border border-line bg-surface text-left font-sans text-sm font-normal tracking-normal text-ink shadow-float"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
