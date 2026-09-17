import type { InputHTMLAttributes, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "id"> & {
  id: string;
  label: ReactNode;
  error?: string;
};

export function Checkbox({ id, label, error, className, ...rest }: CheckboxProps) {
  return (
    <div className={cn("grid gap-1", className)}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5 text-sm text-muted">
        <span className="relative mt-0.5 grid size-4 shrink-0 place-items-center">
          <input
            id={id}
            name={rest.name ?? id}
            type="checkbox"
            aria-invalid={Boolean(error) || undefined}
            className={cn(
              "peer size-4 cursor-pointer appearance-none rounded-[5px] border bg-surface transition-colors",
              "checked:border-accent checked:bg-accent",
              error ? "border-bad" : "border-line",
            )}
            {...rest}
          />
          <Check
            aria-hidden
            strokeWidth={3}
            className="pointer-events-none absolute size-3 text-accent-ink opacity-0 peer-checked:opacity-100"
          />
        </span>
        <span>{label}</span>
      </label>
      {error && (
        <p role="alert" className="pl-6.5 text-xs text-bad">
          {error}
        </p>
      )}
    </div>
  );
}
