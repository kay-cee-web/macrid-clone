"use client";

import { useState } from "react";
import { Copy, Ellipsis, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { IconButton } from "@/components/ui/IconButton";
import { Menu } from "@/components/ui/Menu";
import { Pill } from "@/components/ui/Pill";
import { extractApiError } from "@/lib/api/errors";
import { initialsOf } from "@/lib/format";
import { removeMember } from "@/services/team";

/** The signed-in owner and every `/teams` row, drawn as one list. */
export type MemberRow = { id: string; name: string; email: string; role: string; owner: boolean };

function Person({ row }: { row: MemberRow }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-ink">
        {initialsOf(row.name).slice(0, 2)}
      </span>
      <div className="grid min-w-0">
        <span className="truncate font-medium text-ink">
          {row.name}
          {row.owner && <span className="text-muted"> (you)</span>}
        </span>
        <span className="truncate text-xs text-muted">{row.email}</span>
      </div>
    </div>
  );
}

async function copyEmail(email: string) {
  try {
    await navigator.clipboard.writeText(email);
    toast.success("Email copied.");
  } catch {
    toast.error("Couldn't copy. Your browser blocked clipboard access.");
  }
}

export function MembersTable({ rows, onChanged }: { rows: MemberRow[] | null; onChanged: () => void }) {
  const [removing, setRemoving] = useState<MemberRow | null>(null);

  async function confirmRemove() {
    if (!removing) return false;
    try {
      await removeMember(removing.id);
      toast.success(`${removing.name} was removed from this workspace.`);
      onChanged();
      return true;
    } catch (err) {
      toast.error(extractApiError(err, "Could not remove that member"));
      return false;
    }
  }

  const columns: Column<MemberRow>[] = [
    { key: "name", header: "Workspace members", cell: (row) => <Person row={row} /> },
    {
      key: "role",
      header: "Role",
      cell: (row) => <Pill tone={row.owner ? "accent" : "neutral"}>{row.role}</Pill>,
    },
    {
      key: "action",
      header: "Action",
      className: "w-16",
      cell: (row) => (
        <Menu
          align="end"
          items={[
            { label: "Copy email", icon: <Copy />, onSelect: () => void copyEmail(row.email) },
            ...(row.owner
              ? []
              : [{ label: "Remove from workspace", icon: <UserMinus />, tone: "danger" as const, onSelect: () => setRemoving(row) }]),
          ]}
          trigger={(props) => (
            <IconButton label={`More for ${row.name}`} {...props}>
              <Ellipsis />
            </IconButton>
          )}
        />
      ),
    },
  ];

  return (
    <>
      <DataTable label="Workspace members" columns={columns} rows={rows} rowKey={(row) => row.id} skeletonRows={2} />
      {removing && (
        <ConfirmModal
          title={`Remove ${removing.name}?`}
          description={`${removing.email} loses access to this workspace. They can be added again with the same address.`}
          confirmLabel="Remove member"
          onConfirm={confirmRemove}
          onClose={() => setRemoving(null)}
        />
      )}
    </>
  );
}
