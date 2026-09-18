import * as service from "@/services/agents";
import type { Agent, AgentInput } from "@/types/agent";
import { conversationCopyName } from "./copyName";
import { isUnusedCopy, markUnused, markUsed, scheduleDiscard } from "./fresh";
import { getAgentsState, setAgents } from "./store";

/**
 * Mutations on the shared agents store. Edits apply on screen immediately and
 * roll back only the affected row if the request fails. All of them rethrow,
 * so callers can toast the reason.
 */

const findAgent = (id: string) => getAgentsState().agents.find((agent) => agent.id === id);
const now = () => new Date().toISOString();

function upsert(agent: Agent) {
  setAgents((agents) => [agent, ...agents.filter((a) => a.id !== agent.id)]);
}

export async function createAgent(input: AgentInput = {}) {
  const agent = await service.createAgent(input);
  upsert(agent);
  return agent;
}

export async function updateAgent(id: string, patch: AgentInput) {
  markUsed(id);
  const previous = findAgent(id);
  if (previous) upsert({ ...previous, ...patch, updatedAt: now() });
  try {
    const saved = await service.updateAgent(id, patch);
    upsert(saved);
    return saved;
  } catch (err) {
    if (previous) upsert(previous);
    throw err;
  }
}

export async function setSending(id: string, enabled: boolean) {
  markUsed(id);
  const previous = findAgent(id);
  if (previous) upsert({ ...previous, sendingEnabled: enabled });
  try {
    const result = await service.setAgentSending(id, enabled);
    upsert(result.agent);
    return result;
  } catch (err) {
    if (previous) upsert(previous);
    throw err;
  }
}

/** Star or unstar. The row that comes back wins, so a toggle-style API self-corrects. */
export async function toggleFavorite(id: string) {
  markUsed(id);
  const previous = findAgent(id);
  if (!previous) return false;
  const favorite = !previous.favorite;
  upsert({ ...previous, favorite });
  try {
    const saved = await service.setAgentFavorite(id, favorite);
    if (saved) upsert(saved);
    return saved?.favorite ?? favorite;
  } catch (err) {
    upsert(previous);
    throw err;
  }
}

export async function deleteAgent(id: string) {
  markUsed(id);
  const previous = findAgent(id);
  setAgents((agents) => agents.filter((agent) => agent.id !== id));
  try {
    await service.deleteAgent(id);
  } catch (err) {
    if (previous) upsert(previous);
    throw err;
  }
}

/** Everything the API lets us copy. Channels, history and stats stay on the original. */
const copyOf = (agent: Agent, name: string): AgentInput => ({
  name,
  instructions: agent.instructions,
  isActive: agent.isActive,
  sendingEnabled: agent.sendingEnabled,
  ...(agent.model ? { model: agent.model } : {}),
});

/** Not optimistic: the copy has no id until the backend creates it. */
export function cloneAgent(agent: Agent) {
  return createAgent(copyOf(agent, `${agent.name} copy`));
}

/**
 * History is stored per agent, so a new conversation is a copy ("<name> clone
 * <n>") with an empty thread. An unused copy is reused instead of copied again.
 */
export async function startConversation(agent: Agent) {
  if (isUnusedCopy(agent.id)) return agent;
  const names = getAgentsState().agents.map((a) => a.name);
  const copy = await createAgent(copyOf(agent, conversationCopyName(agent.name, names)));
  markUnused(copy.id);
  return copy;
}

/** Leaving a copy that was never used deletes it quietly. */
export function leaveAgent(id: string) {
  scheduleDiscard(id, () => void deleteAgent(id).catch(() => {}));
}

/**
 * Apply a change the backend already saved (e.g. a chat turn rewrote the
 * agent's instructions). Local only: sending a PUT would race the saved write.
 */
export function mergeAgentLocally(id: string, patch: Partial<Agent>) {
  const previous = findAgent(id);
  if (previous) upsert({ ...previous, ...patch, updatedAt: now() });
}
