import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { pickList, toText } from "@/lib/api/pick";
import { nameFromEmail } from "@/lib/format";
import type { TeamMember } from "@/types/team";

/**
 * Workspace members (Macrid's CRM → Team, same routes). `GET /teams` answers
 * with the rows at `data`; there is no invite email behind `POST /teams`, so
 * adding someone only creates their record.
 */
const normalize = (row: Record<string, unknown>): TeamMember => {
  const username = toText(row.username);
  return {
    id: toText(row.id),
    // A row with neither name nor username still draws, rather than reading as a failed load.
    name: toText(row.name) || username || "Unnamed",
    username,
    email: toText(row.email),
    role: toText(row.role) || "Member",
    addedAt: toText(row.created_at),
  };
};

export async function fetchTeam(): Promise<TeamMember[]> {
  const { data } = await api.get("/teams");
  assertEnvelope(data, "Could not load your members");
  return pickList<Record<string, unknown>>(data, "teams").map(normalize);
}

/**
 * `POST /teams` wants a name and a username as well as the address, so
 * `nameFromEmail` derives both rather than asking for them. They're
 * placeholders until the backend lets a person set their own.
 */
export async function inviteMember(email: string, role = "member"): Promise<void> {
  const address = email.trim();
  const { handle, name } = nameFromEmail(address);
  const { data } = await api.post("/teams", { name, username: handle, email: address, role });
  assertEnvelope(data, "Could not add that member");
}

export async function removeMember(id: string): Promise<void> {
  const { data } = await api.delete(`/teams/${id}`);
  assertEnvelope(data, "Could not remove that member");
}
