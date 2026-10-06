"use client";

import { Button } from "@/components/ui/Button";
import { useSocialSignIn } from "@/hooks/useSocialSignIn";
import { FacebookMark, GoogleMark } from "./SocialMarks";

const PROVIDERS = [
  { id: "google", name: "Google", Mark: GoogleMark },
  { id: "facebook", name: "Facebook", Mark: FacebookMark },
] as const;

/**
 * Google and Facebook above the email form, on both Login and Register: the
 * backend's `/auth/{provider}` flow signs in and signs up in one go, so the
 * buttons are the same on both.
 */
export function SocialAuth() {
  const { start, pending } = useSocialSignIn();

  return (
    <div className="mb-5 grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {PROVIDERS.map(({ id, name, Mark }) => (
          <Button
            key={id}
            type="button"
            variant="secondary"
            size="lg"
            block
            loading={pending === id}
            disabled={pending !== null && pending !== id}
            icon={<Mark className="size-4.5 shrink-0" />}
            onClick={() => start(id)}
          >
            {name}
          </Button>
        ))}
      </div>
      <p className="flex items-center gap-4 text-xs text-faint">
        <span aria-hidden className="h-px flex-1 bg-line" />
        or continue with email
        <span aria-hidden className="h-px flex-1 bg-line" />
      </p>
    </div>
  );
}
