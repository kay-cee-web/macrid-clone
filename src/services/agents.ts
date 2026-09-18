import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { normalizeAgent, normalizeStats, toAgentPayload } from "@/lib/agents/normalize";
import { pickList, pickOne, toBool } from "@/lib/api/pick";
import type { Agent, AgentInput, AgentRow, AgentStats } from "@/types/agent";

/**
 * GET/POST/PUT/DELETE /agents — same contract as Macrid (see AGENTS.md).
 * Every call throws on failure, including `{ status: false }` inside a 200.
 */
const BASE = "/agents";

/** The whole catalog; the API does not paginate. */
export async function fetchAgents(): Promise<Agent[]> {
  const { data } = await api.get(BASE);
  assertEnvelope(data, "Could not load your agents");
  return pickList<AgentRow>(data, "agents").map(normalizeAgent);
}

/** One agent plus its activity counters (the list does not carry stats). */
export async function fetchAgent(id: string): Promise<{ agent: Agent; stats: AgentStats | null }> {
  const { data } = await api.get(`${BASE}/${id}`);
  assertEnvelope(data, "Could not load that agent");
  return {
    agent: normalizeAgent(pickOne<AgentRow>(data, "agent")),
    stats: normalizeStats(data?.stats ?? data?.data?.stats),
  };
}

/** With only `instructions`, the backend picks the agent's name itself. */
export async function createAgent(input: AgentInput = {}): Promise<Agent> {
  const { data } = await api.post(BASE, toAgentPayload(input));
  assertEnvelope(data, "Could not create the agent");
  return normalizeAgent(pickOne<AgentRow>(data, "agent"));
}

export async function updateAgent(id: string, input: AgentInput): Promise<Agent> {
  const { data } = await api.put(`${BASE}/${id}`, toAgentPayload(input));
  assertEnvelope(data, "Could not save the agent");
  return normalizeAgent(pickOne<AgentRow>(data, "agent"));
}

export async function deleteAgent(id: string): Promise<void> {
  const { data } = await api.delete(`${BASE}/${id}`);
  assertEnvelope(data, "Could not delete the agent");
}

/** Kill switch for anything leaving the agent. Returns the updated agent and the API's own wording. */
/**
 * `POST /agents/{id}/favorite`, the sibling of `/sending`. The flag is sent in
 * the body for the explicit form; a bare toggle ignores it and answers without
 * a row, so the caller keeps what it asked for.
 */
export async function setAgentFavorite(id: string, favorite: boolean): Promise<Agent | null> {
  // The column is `is_favorite` and it stores an int, so the flag goes as 1/0 under
  // both spellings: JSON `true` came back as 0 every time, and a missing field reads
  // as false, which made every click an unfavourite.
  const flag = favorite ? 1 : 0;
  const { data } = await api.post(`${BASE}/${id}/favorite`, { favorite: flag, is_favorite: flag });
  assertEnvelope(data, "Could not update your favourites");
  const row = pickOne<AgentRow>(data, "agent");
  if (row?.id === undefined) return null;

  // The row only overrules the click when it actually carries the flag: a row
  // that leaves it out would otherwise read as false and undo the star.
  const reported = row.favorite ?? row.is_favorite;
  return { ...normalizeAgent(row), favorite: reported == null ? favorite : toBool(reported, favorite) };
}

export async function setAgentSending(id: string, enabled: boolean) {
  const { data } = await api.post(`${BASE}/${id}/sending`, { enabled });
  assertEnvelope(data, "Could not change sending");
  return {
    agent: normalizeAgent(pickOne<AgentRow>(data, "agent")),
    message: typeof data?.message === "string" ? data.message : "",
  };
}

/** Activity log. Always empty so far, so rows are returned raw. */
export async function fetchAgentActions(id: string): Promise<unknown[]> {
  const { data } = await api.get(`${BASE}/${id}/actions`);
  assertEnvelope(data, "Could not load the agent's activity");
  return pickList<unknown>(data, "actions");
}
