import type { Agent } from "@/types/agent";

export type AgentSort = "edited" | "created" | "name-asc" | "name-desc";

export const SORT_OPTIONS: { id: AgentSort; label: string }[] = [
  { id: "edited", label: "Last edited" },
  { id: "created", label: "Recently created" },
  { id: "name-asc", label: "Name A–Z" },
  { id: "name-desc", label: "Name Z–A" },
];

export const DEFAULT_SORT: AgentSort = "edited";

/** Unknown timestamps sink to the bottom rather than floating to the top. */
const time = (value: string | null) => {
  const t = value ? new Date(value).getTime() : NaN;
  return Number.isNaN(t) ? -Infinity : t;
};

const byName = (a: Agent, b: Agent) =>
  a.name.localeCompare(b.name, undefined, { sensitivity: "base", numeric: true });

const COMPARATORS: Record<AgentSort, (a: Agent, b: Agent) => number> = {
  edited: (a, b) => time(b.updatedAt) - time(a.updatedAt),
  created: (a, b) => time(b.createdAt) - time(a.createdAt),
  "name-asc": byName,
  "name-desc": (a, b) => byName(b, a),
};

export const sortAgents = (agents: Agent[], sort: AgentSort = DEFAULT_SORT) =>
  [...agents].sort(COMPARATORS[sort]);

export function filterAgents(agents: Agent[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return agents;
  return agents.filter(
    (agent) => agent.name.toLowerCase().includes(q) || agent.instructions.toLowerCase().includes(q),
  );
}
