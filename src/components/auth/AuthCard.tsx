import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type AuthCardProps = {
  /** Sets the tone of the screen at a glance: a lock to sign in, a key to reset. */
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  children: ReactNode;
};

/** The floating panel every auth screen sits in. */
export function AuthCard({ icon: Icon, title, description, children }: AuthCardProps) {
  return (
    <section className="rounded-[20px] border border-line bg-surface p-6 shadow-lift sm:p-8">
      <span aria-hidden className="inline-flex size-11 items-center justify-center rounded-[14px] bg-accent-soft text-accent">
        <Icon className="size-5" />
      </span>
      <div className="mb-7 mt-5 grid gap-2">
        <h1 className="text-2xl font-semibold leading-[1.1] sm:text-3xl">{title}</h1>
        {description && <p className="text-sm text-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}

/** "Don't have an account? Create one" style line under the card. */
export function AuthSwitch({ children }: { children: ReactNode }) {
  return (
    <p className="text-center text-sm text-muted [&_a]:font-medium [&_a]:text-accent hover:[&_a]:underline">
      {children}
    </p>
  );
}
