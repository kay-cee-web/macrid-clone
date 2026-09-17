"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Info } from "lucide-react";
import { WorkReceipt } from "@/components/agents/WorkReceipt";
import { statsOf } from "@/lib/records/diff";
import type { WorkChange } from "@/types/receipt";

const VISIBLE = 5;
const HOW_IT_WORKS =
  "Read from Records before and after this reply. Changes made elsewhere at the same time (a teammate, another agent) show here too.";

/** What a chat turn changed in the workspace, each line linking to its Records page. */
export function TurnReceipt({ changes, className }: { changes: WorkChange[]; className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? changes : changes.slice(0, VISIBLE);
  const hidden = changes.length - shown.length;

  return (
    <WorkReceipt
      area="Changed in your workspace"
      stats={statsOf(changes)}
      badge={
        <span title={HOW_IT_WORKS} className="inline-flex text-faint">
          <Info className="size-3.5" aria-label={HOW_IT_WORKS} />
        </span>
      }
      className={className}
    >
      <ul className="divide-y divide-line">
        {shown.map((change, index) => (
          <li key={`${change.href}-${index}`}>
            <Link
              href={change.href}
              className="group/row flex items-center gap-2 px-3 py-2 text-sm text-ink transition-colors hover:bg-raised focus-visible:bg-raised"
            >
              <span className="hidden w-[4.75rem] shrink-0 font-mono sm:inline text-xs uppercase tracking-[0.06em] text-muted">{change.area}</span>
              <span className="min-w-0 flex-1 truncate" title={change.text}>{change.text}</span>
              <ArrowUpRight className="size-3.5 shrink-0 text-faint transition-colors group-hover/row:text-accent" />
            </Link>
          </li>
        ))}
      </ul>
      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="w-full border-t border-line px-3 py-2 text-left text-xs font-medium text-accent hover:bg-raised"
        >
          Show {hidden} more
        </button>
      )}
    </WorkReceipt>
  );
}
