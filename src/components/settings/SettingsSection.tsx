import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** A titled group of settings rows inside one bordered panel. */
export function SettingsSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("grid gap-3", className)}>
      <div className="grid gap-1">
        <h2 className="text-[18px] font-semibold">{title}</h2>
        {description && <p className="max-w-[62ch] text-[13.5px] text-muted">{description}</p>}
      </div>
      <div className="divide-y divide-line overflow-hidden rounded-[14px] border border-line bg-surface">{children}</div>
    </section>
  );
}

/** Label and help text on the left, the control on the right (stacks on phones). */
export function SettingRow({
  label,
  description,
  htmlFor,
  children,
}: {
  label: string;
  description?: ReactNode;
  htmlFor?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="grid min-w-0 gap-0.5">
        {htmlFor ? (
          <label htmlFor={htmlFor} className="text-[14px] font-medium text-ink">
            {label}
          </label>
        ) : (
          <span className="text-[14px] font-medium text-ink">{label}</span>
        )}
        {description && <div className="text-[13px] text-muted">{description}</div>}
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  );
}
