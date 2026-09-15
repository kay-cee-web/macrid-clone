import * as service from "@/services/agents";
import type { Agent, AgentInput } from "@/types/agent";
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

export async function deleteAgent(id: string) {
  const previous = findAgent(id);
  setAgents((agents) => agents.filter((agent) => agent.id !== id));
  try {
    await service.deleteAgent(id);
  } catch (err) {
    if (previous) upsert(previous);
    throw err;
  }
}

/** Not optimistic: the copy has no id until the backend creates it. */
export function cloneAgent(agent: Agent) {
  return createAgent({
    name: `${agent.name} copy`,
    instructions: agent.instructions,
    ...(agent.model ? { model: agent.model } : {}),
  });
}

/**
 * Apply a change the backend already saved (e.g. a chat turn rewrote the
 * agent's instructions). Local only: sending a PUT would race the saved write.
 */
export function mergeAgentLocally(id: string, patch: Partial<Agent>) {
  const previous = findAgent(id);
  if (previous) upsert({ ...previous, ...patch, updatedAt: now() });
}
