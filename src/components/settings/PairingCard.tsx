"use client";

import { Check, Copy, ExternalLink, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buttonStyles } from "@/components/ui/button-styles";
import { QrCode } from "@/components/ui/QrCode";
import { WorkingTrace } from "@/components/ui/WorkingTrace";
import type { ChannelInfo } from "@/data/channels";
import { useClipboard } from "@/hooks/useClipboard";
import { formatClock, useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/cn";
import type { Pairing } from "@/types/channel";

type PairingCardProps = {
  channel: ChannelInfo;
  pairing: Pairing;
  onNewCode: () => void;
  requesting: boolean;
};

/** Mount with key={pairing.code} so every new code gets a fresh countdown. */
export function PairingCard({ channel, pairing, onNewCode, requesting }: PairingCardProps) {
  const { remaining, done: expired } = useCountdown(pairing.expiresIn);
  const { copied, copy } = useClipboard();
  const shortcut = channel.shortcutLabel && pairing.shortcutUrl;
  const percent = Math.max(0, Math.min(100, (remaining / pairing.expiresIn) * 100));

  return (
    <div className="grid gap-5 rounded-[14px] border border-line bg-surface p-5 sm:grid-cols-[minmax(0,1fr)_auto]">
      <div className="grid content-start gap-4">
        <div
          className={cn(
            "rounded-[10px] border border-dashed border-line bg-raised px-4 py-3 text-center font-mono text-[32px] font-medium tracking-[0.18em]",
            expired && "text-faint line-through",
          )}
        >
          {pairing.code}
        </div>

        <div className="grid gap-1.5">
          <div className="flex justify-between text-[12.5px] text-muted">
            <span>{expired ? "This code has expired." : "Code expires in"}</span>
            <span className="font-mono tabular-nums">{formatClock(remaining)}</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-line">
            <div className={cn("h-full transition-[width]", expired ? "bg-bad" : "bg-accent")} style={{ width: `${percent}%` }} />
          </div>
        </div>

        {pairing.instructions && !expired && (
          <p className="whitespace-pre-line text-[13.5px] text-muted">{pairing.instructions}</p>
        )}

        {expired ? (
          <Button icon={<RotateCw className="size-4" />} loading={requesting} onClick={onNewCode} className="justify-self-start">
            Get a new code
          </Button>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {shortcut && (
                <a href={pairing.shortcutUrl} target="_blank" rel="noreferrer" className={buttonStyles()}>
                  {channel.shortcutLabel}
                  <ExternalLink className="size-3.5" />
                </a>
              )}
              <Button
                variant="secondary"
                icon={copied ? <Check className="size-4 text-good" /> : <Copy className="size-4" />}
                onClick={() => void copy(channel.id === "extension" ? pairing.code : pairing.message)}
              >
                {channel.id === "extension" ? "Copy code" : `Copy “${pairing.message}”`}
              </Button>
            </div>
            <WorkingTrace label={`Waiting for your ${channel.id === "extension" ? "code" : "message"}…`} />
          </>
        )}
      </div>

      {channel.qr && shortcut && !expired && (
        <figure className="grid justify-items-center gap-2 sm:w-40">
          <QrCode value={pairing.shortcutUrl} label={`QR code that opens ${channel.name}`} className="size-40" />
          <figcaption className="text-center text-[12px] text-muted">Scan with the phone you want linked</figcaption>
        </figure>
      )}
    </div>
  );
}
