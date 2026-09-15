import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  tone?: "neutral" | "bad";
  className?: string;
};

export function EmptyState({ icon, title, description, action, tone = "neutral", className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "grid justify-items-center gap-3 rounded-[14px] border border-dashed border-line px-6 py-14 text-center",
        className,
      )}
    >
      {icon && (
        <span
          className={cn(
            "grid size-10 place-items-center rounded-[12px] [&_svg]:size-5",
            tone === "bad" ? "bg-bad-soft text-bad" : "bg-raised text-muted ring-1 ring-inset ring-line",
          )}
        >
          {icon}
        </span>
      )}
      <h3 className="text-[17px] font-semibold">{title}</h3>
      {description && <p className="max-w-[46ch] text-[14px] text-muted">{description}</p>}
      {action && <div className="mt-1 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}
