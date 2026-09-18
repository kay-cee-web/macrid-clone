"use client";

import { useState, type FormEvent } from "react";
import { CircleAlert, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { extractApiError, fieldErrors } from "@/lib/api/errors";
import { useAsync } from "@/hooks/useAsync";
import { fetchTeam, inviteMember } from "@/services/team";
import type { User } from "@/types/auth";
import { MembersTable, type MemberRow } from "./MembersTable";
import { PanelHeading } from "./SettingsPanels";

const ownerRow = (user: User | null): MemberRow => ({
  id: "owner",
  name: user?.name || "You",
  email: user?.email ?? "",
  role: "Owner",
  owner: true,
});

/** Workspace members: the owner plus every `/teams` row. */
export function MembersPanel({ user }: { user: User | null }) {
  const team = useAsync(fetchTeam, [], "Could not load your members");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const rows = team.data ? [ownerRow(user), ...team.data.map((m) => ({ ...m, owner: false }))] : null;

  async function invite(event: FormEvent) {
    event.preventDefault();
    const address = email.trim();
    if (!address) return setError("Type the email address to add.");
    setSaving(true);
    try {
      await inviteMember(address);
      toast.success(`${address} was added to this workspace.`);
      setEmail("");
      team.reload();
    } catch (err) {
      setError(fieldErrors(err).email ?? "");
      toast.error(extractApiError(err, "Could not add that member"));
    }
    setSaving(false);
  }

  return (
    <div className="grid gap-6">
      <PanelHeading title="Members" description="Who works in this workspace, and what they can reach." />

      <form onSubmit={invite} className="flex flex-wrap items-start gap-2" noValidate>
        <div className="grid min-w-52 flex-1 gap-1.5">
          <label htmlFor="invite-email" className="sr-only">
            Email to add
          </label>
          <Input
            id="invite-email"
            type="email"
            autoComplete="off"
            placeholder="Email address to add"
            value={email}
            invalid={Boolean(error)}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
          />
          {error && (
            <p role="alert" className="text-xs text-bad">
              {error}
            </p>
          )}
        </div>
        <Button type="submit" loading={saving} className="h-11">
          Add member
        </Button>
      </form>

      <p className="flex items-start gap-2 rounded-xl bg-raised/60 px-3 py-2.5 text-xs text-muted">
        <Info className="mt-px size-3.5 shrink-0" />
        Adding someone creates their record — Dexisphere doesn&apos;t send an invite email yet, so pass the word on
        yourself. Roles aren&apos;t stored yet either: everyone you add joins as a member.
      </p>

      {team.status === "error" ? (
        <p role="alert" className="flex flex-wrap items-center gap-2 rounded-xl bg-bad-soft px-4 py-3 text-sm text-bad">
          <CircleAlert className="size-4" />
          {team.error}
          <Button variant="ghost" size="sm" className="ml-auto" loading={team.refreshing} onClick={team.reload}>
            Try again
          </Button>
        </p>
      ) : (
        <MembersTable rows={rows} onChanged={team.reload} />
      )}
    </div>
  );
}
