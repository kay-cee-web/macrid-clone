import type { ReactNode } from "react";
import { Pill } from "@/components/ui/Pill";
import { formatDate, timeAgo } from "@/lib/format";
import { statusLabel, statusTone } from "@/lib/records/status";

/** A faint dash for empty cells, so columns stay scannable. */
export function Blank() {
  return <span className="text-faint">—</span>;
}

export function TextCell({ value, muted }: { value: ReactNode; muted?: boolean }) {
  if (value === "" || value === null || value === undefined) return <Blank />;
  return <span className={muted ? "text-muted" : undefined}>{value}</span>;
}

export function StatusCell({ status }: { status: string }) {
  if (!status) return <Blank />;
  return <Pill tone={statusTone(status)}>{statusLabel(status)}</Pill>;
}

/** "3 hours ago" for recent rows, the date after a month; full date on hover. */
export function CreatedCell({ value }: { value: string | null }) {
  if (!value) return <Blank />;
  return (
    <time dateTime={value} title={formatDate(value)} className="whitespace-nowrap text-muted">
      {timeAgo(value)}
    </time>
  );
}

/** Main cell text with a quieter second line. */
export function StackCell({ primary, secondary }: { primary: ReactNode; secondary?: ReactNode }) {
  return (
    <span className="grid min-w-0 max-w-104 gap-0.5">
      <span className="truncate">{primary}</span>
      {secondary && <span className="truncate text-[12.5px] font-normal text-muted">{secondary}</span>}
    </span>
  );
}
