import type { ReactNode } from "react";
import { ConnectorLogo } from "@/components/plugins/ConnectorLogo";
import { Pill } from "@/components/ui/Pill";
import { CONNECTORS_BY_KEY } from "@/data/connectors";
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

/** A connector's logo and name ("Stripe", "LinkedIn"); unknown keys show as written. */
export function ConnectorCell({ connectorKey, secondary }: { connectorKey: string; secondary?: ReactNode }) {
  const connector = CONNECTORS_BY_KEY[connectorKey];
  if (!connector) return <TextCell value={connectorKey} muted />;
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <ConnectorLogo connector={connector} className="size-7 rounded-md" />
      <StackCell primary={connector.name} secondary={secondary} />
    </span>
  );
}

/** Main cell text with a quieter second line. */
export function StackCell({ primary, secondary }: { primary: ReactNode; secondary?: ReactNode }) {
  return (
    <span className="grid min-w-0 max-w-104 gap-0.5">
      <span className="truncate">{primary}</span>
      {secondary && <span className="truncate text-xs font-normal text-muted">{secondary}</span>}
    </span>
  );
}
