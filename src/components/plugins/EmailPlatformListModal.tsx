"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { extractApiError } from "@/lib/api/errors";
import { fetchEmailPlatformLists, fetchEmailPlatforms, setEmailPlatformList } from "@/services/emailPlatforms";
import type { Connector } from "@/types/connector";
import type { EmailPlatformConnection, RemoteList } from "@/types/emailPlatform";

type Props = { connector: Connector; onClose: () => void; onSaved: () => void };

/** The connection and its lists together, so the id never comes from stale card state. */
async function load(platform: string) {
  const connection = (await fetchEmailPlatforms()).find((row) => row.platform === platform);
  if (!connection) throw new Error("That connection is gone. Connect it again.");
  return { connection, lists: await fetchEmailPlatformLists(connection.id) };
}

function ListForm({ connection, lists, onClose, onSaved }: Props & {
  connection: EmailPlatformConnection;
  lists: RemoteList[];
}) {
  const { listWord } = connection;
  const [listId, setListId] = useState(connection.listId);
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!listId) return setFailure(`Choose an ${listWord} first.`);
    setSaving(true);
    try {
      toast.success(await setEmailPlatformList(connection.id, listId, listWord));
      onSaved();
      onClose();
    } catch (err) {
      const message = extractApiError(err, `Could not choose the ${listWord}`);
      setFailure(message);
      toast.error(message);
      setSaving(false);
    }
  }

  if (!lists.length) {
    return (
      <div className="grid justify-items-start gap-4">
        <Alert tone="warn">
          There&apos;s no {listWord} on this account yet. Make one in {connection.platform === "mailchimp" ? "Mailchimp" : "the platform"}, then come back.
        </Alert>
        <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      {failure && <Alert>{failure}</Alert>}
      <Field
        id="email-platform-list"
        label={`Which ${listWord}?`}
        hint="Imports read from here, and leads you send go here. Unsubscribed contacts are left out both ways."
      >
        <Select
          id="email-platform-list"
          value={listId}
          onChange={(event) => {
            setListId(event.target.value);
            setFailure("");
          }}
        >
          <option value="">Choose an {listWord}…</option>
          {lists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.count === null ? list.name : `${list.name} · ${list.count.toLocaleString()} contacts`}
            </option>
          ))}
        </Select>
      </Field>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={saving}>Save {listWord}</Button>
      </div>
    </form>
  );
}

/**
 * Which list on the platform's side this connection reads from and writes to.
 * Until one is chosen the card says so and nothing can sync — except Systeme.io,
 * which groups by tag and never opens this.
 */
export function EmailPlatformListModal(props: Props) {
  const { connector, onClose } = props;
  const state = useAsync(() => load(connector.key), [connector.key], `Could not load your ${connector.name} lists`);

  return (
    <Modal
      open
      onClose={onClose}
      title={`${connector.name} ${state.data?.connection.listWord ?? "list"}`}
      description={`Pick the one ${connector.name} should sync with.`}
    >
      {state.status === "loading" && (
        <div className="grid gap-3" aria-busy>
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      )}
      {state.status === "error" && (
        <div className="grid justify-items-start gap-4">
          <Alert>{state.error}</Alert>
          <Button variant="secondary" size="sm" onClick={state.reload}>Try again</Button>
        </div>
      )}
      {state.status === "ready" && state.data && (
        <ListForm {...props} connection={state.data.connection} lists={state.data.lists} />
      )}
    </Modal>
  );
}
