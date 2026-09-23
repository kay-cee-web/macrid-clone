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
import { deleteMailbox, fetchMailboxes, testMailbox, type Mailbox } from "@/services/mailboxes";

type MailboxesModalProps = { onClose: () => void; onAdd: () => void; onChanged: () => void };

/**
 * Every connected mailbox, each testable and removable on its own. The agent
 * reads the first unless a task names another address.
 */
export function MailboxesModal({ onClose, onAdd, onChanged }: MailboxesModalProps) {
  const mailboxes = useAsync(fetchMailboxes, [], "Could not load your mailboxes");
  const [testing, setTesting] = useState<string | null>(null);
  const [removing, setRemoving] = useState<Mailbox | null>(null);

  async function test(mailbox: Mailbox) {
    setTesting(mailbox.id);
    try {
      toast.success(await testMailbox(mailbox.id));
    } catch (err) {
      toast.error(extractApiError(err, `${mailbox.email} didn't answer`));
    } finally {
      setTesting(null);
      mailboxes.reload();
    }
  }

  const rows = mailboxes.data ?? [];

  return (
    <Modal
      open
      onClose={onClose}
      title="Mailboxes"
      description="Agents read the first one unless a task names another address."
      footer={<Button variant="secondary" onClick={onAdd}>Add mailbox</Button>}
    >
      {mailboxes.status === "error" ? (
        <div role="alert" className="grid justify-items-start gap-3 text-sm text-bad">
          {mailboxes.error}
          <Button size="sm" variant="secondary" onClick={mailboxes.reload}>Try again</Button>
        </div>
      ) : !mailboxes.data ? (
        <div className="grid gap-2"><Skeleton className="h-14" /><Skeleton className="h-14" /></div>
      ) : !rows.length ? (
        <p className="text-sm text-muted">No mailboxes are connected.</p>
      ) : (
        <ul className="grid divide-y divide-line rounded-xl border border-line">
          {rows.map((mailbox) => (
            <li key={mailbox.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
              <div className="grid min-w-0 flex-1 basis-48 gap-1">
                <span className="truncate text-sm font-medium text-ink">{mailbox.email || "Unnamed mailbox"}</span>
                <span className="flex flex-wrap items-center gap-2">
                  {mailbox.active ? <Pill tone="good" dot>Working</Pill> : <Pill tone="bad" dot>Not working</Pill>}
                  {mailbox.provider && <span className="font-mono text-xs text-faint">{mailbox.provider}</span>}
                </span>
                {mailbox.error && <span className="text-xs text-bad">{mailbox.error}</span>}
              </div>
              <Button size="sm" variant="ghost" loading={testing === mailbox.id} onClick={() => void test(mailbox)}>
                Test
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setRemoving(mailbox)}>Remove</Button>
            </li>
          ))}
        </ul>
      )}

      {removing && (
        <ConfirmModal
          title={`Remove ${removing.email || "this mailbox"}?`}
          description="Agents stop reading it. Its mail stays where it is."
          confirmLabel="Remove"
          onClose={() => setRemoving(null)}
          onConfirm={async () => {
            try {
              await deleteMailbox(removing.id);
              toast.success("Mailbox removed.");
              return true;
            } catch (err) {
              toast.error(extractApiError(err, "Could not remove the mailbox"));
              return false;
            } finally {
              mailboxes.reload();
              onChanged();
            }
          }}
        />
      )}
    </Modal>
  );
}
