import type { ReactNode } from "react";

export function AuthHeading({ title, description }: { title: string; description?: ReactNode }) {
  return (
    <div className="mb-8 grid gap-2">
      <h1 className="text-3xl font-semibold leading-[1.08]">{title}</h1>
      {description && <p className="text-base text-muted">{description}</p>}
    </div>
  );
}

/** "Don't have an account? Create one" style line under a form. */
export function AuthSwitch({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 text-center text-sm text-muted [&_a]:font-medium [&_a]:text-accent hover:[&_a]:underline">
      {children}
    </p>
  );
}
