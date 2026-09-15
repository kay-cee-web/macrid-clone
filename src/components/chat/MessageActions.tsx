"use client";

import { Check, Copy, Square, Volume2 } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { useClipboard } from "@/hooks/useClipboard";
import { useSpeech } from "@/hooks/useSpeech";
import { cn } from "@/lib/cn";

/** Copy (and for agent replies, read aloud). Visible on hover or focus. */
export function MessageActions({ text, speak = false, className }: { text: string; speak?: boolean; className?: string }) {
  const { copied, copy } = useClipboard();
  const speech = useSpeech();

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100",
        (copied || speech.speaking) && "opacity-100",
        className,
      )}
    >
      <IconButton size="sm" label={copied ? "Copied" : "Copy message"} onClick={() => void copy(text)}>
        {copied ? <Check className="text-good" /> : <Copy />}
      </IconButton>
      {speak && speech.supported && (
        <IconButton size="sm" label={speech.speaking ? "Stop reading" : "Read aloud"} onClick={() => speech.toggle(text)}>
          {speech.speaking ? <Square /> : <Volume2 />}
        </IconButton>
      )}
    </div>
  );
}
