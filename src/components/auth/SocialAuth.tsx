"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { GitHubMark, GoogleMark } from "./SocialMarks";

const PROVIDERS = [
  { id: "google", name: "Google", Mark: GoogleMark },
  { id: "github", name: "GitHub", Mark: GitHubMark },
] as const;

/**
 * Google and GitHub buttons above the email form. There is no social sign-in on
 * the backend yet (only `POST /login` and `POST /register`), so a click says so
 * rather than opening a flow that can't finish.
 */
export function SocialAuth() {
  return (
    <div className="mb-6 grid gap-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {PROVIDERS.map(({ id, name, Mark }) => (
          <Button
            key={id}
            type="button"
            variant="secondary"
            size="lg"
            block
            icon={<Mark className="size-4.5 shrink-0" />}
            onClick={() =>
              toast.message(`${name} sign-in is coming soon.`, {
                description: "Use your email and password for now.",
              })
            }
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
