"use client";

import { useCallback, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { useAskAgent } from "@/hooks/useAskAgent";
import { useDismiss } from "@/hooks/useDismiss";
import { useDraggable } from "@/hooks/useDraggable";
import { cn } from "@/lib/cn";
import { askAgentMessage } from "@/lib/notes/askAgent";
import { AskAgentPanel } from "./AskAgentPanel";

/**
 * "Ask agent": a floating handle over the note that can be dragged anywhere in
 * the window, and opens a request box beside itself on a click.
 *
 * It starts in the bottom-right corner. Once moved, the box opens on whichever
 * side has room — below the handle in the top half of the window, above it in
 * the bottom half — so it never runs off the screen.
 */
export function AskAgent({
  note,
  onReply,
}: {
  note: { title: string; body: string };
  onReply: (reply: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const drag = useDraggable();
  const writer = useAskAgent(onReply);

  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, rootRef, close);

  const below = drag.pos ? drag.pos.y < window.innerHeight / 2 : false;
  const alignRight = drag.pos ? drag.pos.x > window.innerWidth / 2 : true;

  return (
    <div
      ref={rootRef}
      className={cn("fixed z-40", !drag.pos && "bottom-24 right-4 sm:bottom-6 sm:right-6")}
      style={drag.pos ? { left: drag.pos.x, top: drag.pos.y } : undefined}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        title="Drag to move"
        {...drag.handlers}
        onClick={() => {
          if (!drag.wasDrag()) setOpen((on) => !on);
        }}
        className="inline-flex touch-none select-none items-center gap-2 rounded-full bg-cta px-4 py-2.5 text-sm font-medium text-accent-ink shadow-glow transition-[filter] hover:brightness-110 active:cursor-grabbing"
      >
        {writer.busy ? <Spinner className="size-4" label="Writing" /> : <Sparkles className="size-4" />}
        {writer.busy ? "Writing…" : "Ask agent"}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Ask an agent to write"
          className={cn(
            "absolute w-[min(22rem,calc(100vw-2rem))] animate-fade-in rounded-[14px] border border-line bg-surface p-3 shadow-float",
            below ? "top-full mt-2" : "bottom-full mb-2",
            alignRight ? "right-0" : "left-0",
          )}
        >
          <AskAgentPanel
            agents={writer.agents}
            agent={writer.agent}
            loading={writer.loading}
            busy={writer.busy}
            onPick={writer.pick}
            onAsk={async (request) => {
              const done = await writer.ask(askAgentMessage(request, note));
              if (done) close();
              return done;
            }}
          />
        </div>
      )}
    </div>
  );
}
