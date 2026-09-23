import { ExternalLink, KeyRound } from "lucide-react";
import type { MailboxProvider } from "@/services/mailboxes";

/**
 * How to make an app password for the chosen provider, in the backend's own
 * words. The account password never works here, so this sits above the form.
 */
export function MailboxProviderHelp({ provider }: { provider: MailboxProvider }) {
  if (provider.custom) {
    return (
      <p className="text-sm text-muted">
        Enter your server&apos;s IMAP details. Most hosts list them in their help pages under &ldquo;IMAP&rdquo;.
      </p>
    );
  }

  return (
    <div className="grid gap-2 rounded-xl border border-line bg-raised/40 p-4 text-sm">
      <p className="flex items-center gap-2 font-medium text-ink">
        <KeyRound className="size-4 text-muted" aria-hidden />
        {provider.name} needs an app password, not your usual one
      </p>
      {provider.steps.length === 1 ? (
        <p className="text-muted">{provider.steps[0]}</p>
      ) : provider.steps.length > 1 ? (
        <ol className="grid list-decimal gap-1 pl-5 text-muted">
          {provider.steps.map((step) => <li key={step}>{step}</li>)}
        </ol>
      ) : (
        <p className="text-muted">Turn on 2-Step Verification, then make an app password in your account&apos;s security settings.</p>
      )}
      {provider.helpUrl && (
        <a
          href={provider.helpUrl.startsWith("http") ? provider.helpUrl : `https://${provider.helpUrl}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-1.5 font-medium text-accent hover:underline"
        >
          Make an app password
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
      )}
      <p className="text-xs text-faint">
        Work accounts can have app passwords switched off by an admin, and phones can&apos;t make them, so use a browser.
      </p>
    </div>
  );
}
