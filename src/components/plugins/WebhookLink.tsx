"use client";

import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useClipboard } from "@/hooks/useClipboard";
import type { PaymentWebhook } from "@/types/payment";

/** The connection's own webhook URL with a copy button, and the provider's steps for where it goes. */
export function WebhookLink({ webhook, provider }: { webhook: PaymentWebhook; provider: string }) {
  const { copied, copy } = useClipboard();

  return (
    <section className="grid gap-3">
      <div className="grid gap-1">
        <h3 className="text-sm font-medium">1. Paste this link into {provider}</h3>
        <p className="text-xs text-muted">It stays the same for as long as this account is connected.</p>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-line bg-raised px-3 py-2">
        <code className="min-w-0 flex-1 truncate font-mono text-xs text-ink">{webhook.url || "No link came back yet."}</code>
        {webhook.url && (
          <Button
            size="sm"
            variant="secondary"
            icon={copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            onClick={() => void copy(webhook.url, "Webhook link copied.")}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </div>
      {webhook.url && (
        <p className="flex items-center gap-2 text-xs text-muted">
          <span aria-hidden className={webhook.verified ? "size-1.5 rounded-full bg-good" : "size-1.5 rounded-full bg-faint"} />
          {webhook.verified
            ? `${provider} is reaching us${webhook.lastEvent ? ` · last event ${webhook.lastEvent}` : ""}.`
            : `Nothing from ${provider} yet. Events show up here once the link and secret are in.`}
        </p>
      )}
      {webhook.steps.length > 0 && (
        <ol className="grid list-decimal gap-1.5 pl-5 text-sm text-muted marker:font-mono marker:text-xs marker:text-faint">
          {webhook.steps.map((step) => <li key={step}>{step}</li>)}
        </ol>
      )}
    </section>
  );
}
