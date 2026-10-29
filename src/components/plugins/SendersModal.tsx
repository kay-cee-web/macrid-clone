"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Modal } from "@/components/ui/Modal";
import { Pill } from "@/components/ui/Pill";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { extractApiError } from "@/lib/api/errors";
import { SENDER_KINDS, type SenderRow } from "@/lib/connections/senderKinds";
import type { Connector } from "@/types/connector";

type SendersModalProps = { connector: Connector; onClose: () => void; onAdd: () => void; onChanged: () => void };

/** Every SMTP mailbox or Twilio number on the workspace, each removable on its own. */
export function SendersModal({ connector, onClose, onAdd, onChanged }: SendersModalProps) {
  const kind = SENDER_KINDS[connector.store ?? ""];
  const senders = useAsync(() => kind.load(), [kind], `Could not load your ${connector.name} senders`);
  const [removing, setRemoving] = useState<SenderRow | null>(null);
  const rows = senders.data ?? [];

  return (
    <Modal
      open
      onClose={onClose}
      title={connector.name}
      description={kind.description}
      footer={<Button variant="secondary" onClick={onAdd}>Add {kind.noun}</Button>}
    >
      {senders.status === "error" ? (
        <div role="alert" className="grid justify-items-start gap-3 text-sm text-bad">
          {senders.error}
          <Button size="sm" variant="secondary" onClick={senders.reload}>Try again</Button>
        </div>
      ) : !senders.data ? (
        <div className="grid gap-2"><Skeleton className="h-14" /><Skeleton className="h-14" /></div>
      ) : !rows.length ? (
        <p className="text-sm text-muted">Nothing is connected.</p>
      ) : (
        <ul className="grid divide-y divide-line rounded-xl border border-line">
          {rows.map((row) => (
            <li key={row.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
              <div className="grid min-w-0 flex-1 basis-48 gap-1">
                <span className="truncate text-sm font-medium text-ink">{row.title}</span>
                <span className="flex flex-wrap items-center gap-2">
                  {row.active ? <Pill tone="good" dot>Active</Pill> : <Pill dot>Inactive</Pill>}
                  {row.detail && <span className="font-mono text-xs text-faint">{row.detail}</span>}
                </span>
              </div>
              <Button size="sm" variant="secondary" onClick={() => setRemoving(row)}>Remove</Button>
            </li>
          ))}
        </ul>
      )}

      {removing && (
        <ConfirmModal
          title={`Remove ${removing.title}?`}
          description={kind.removeNote}
          confirmLabel="Remove"
          onClose={() => setRemoving(null)}
          onConfirm={async () => {
            try {
              await kind.remove(removing.id);
              toast.success(`${removing.title} removed.`);
              return true;
            } catch (err) {
              toast.error(extractApiError(err, `Could not remove ${removing.title}`));
              return false;
            } finally {
              senders.reload();
              onChanged();
            }
          }}
        />
      )}
    </Modal>
  );
}
