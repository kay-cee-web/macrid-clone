import { cn } from "@/lib/cn";

const LEVELS = [
  { label: "Too short", bar: "bg-bad" },
  { label: "Weak", bar: "bg-bad" },
  { label: "Fair", bar: "bg-warn" },
  { label: "Good", bar: "bg-accent" },
  { label: "Strong", bar: "bg-good" },
];

/** 0–4: one point each for length, mixed case, a digit and a symbol, but nothing under 8 characters. */
export function passwordScore(value: string) {
  if (value.length < 8) return 0;
  const checks = [value.length >= 12, /[a-z]/.test(value) && /[A-Z]/.test(value), /\d/.test(value), /[^A-Za-z0-9]/.test(value)];
  return Math.max(1, checks.filter(Boolean).length);
}

/** Tapotik's four-segment meter under the password field. */
export function PasswordStrength({ value }: { value: string }) {
  const score = passwordScore(value);
  const level = LEVELS[score];

  return (
    <div className="-mt-2 grid gap-1.5">
      <div aria-hidden className="grid grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map((step) => (
          <span
            key={step}
            className={cn("h-1 rounded-full transition-colors", value && score >= step ? level.bar : "bg-line")}
          />
        ))}
      </div>
      <p aria-live="polite" className={cn("text-xs text-muted", !value && "sr-only")}>
        {value ? `Password strength: ${level.label}` : "Use at least 8 characters."}
      </p>
    </div>
  );
}
