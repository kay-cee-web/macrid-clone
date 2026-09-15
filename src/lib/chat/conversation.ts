/**
 * History is stored per agent, not per conversation. "New conversation" gives
 * the thread a fresh `?c=` id: a fresh id minted in this tab starts empty, and
 * any other id (e.g. after a reload) loads the agent's full history.
 */
const minted = new Set<string>();

export function newConversationId() {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  minted.add(id);
  return id;
}

export const isFreshConversation = (id: string | null | undefined) => Boolean(id && minted.has(id));

export const newMessageId = () =>
  `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
