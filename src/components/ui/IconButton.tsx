import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Required: an icon-only control needs a spoken name. */
  label: string;
  children: ReactNode;
  size?: "sm" | "md";
  bordered?: boolean;
};

export function IconButton({
  label,
  children,
  size = "md",
  bordered = false,
  className,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-lg text-muted transition-colors",
        "hover:bg-raised hover:text-ink disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:size-4",
        size === "sm" ? "size-7" : "size-8",
        bordered && "border border-line",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
