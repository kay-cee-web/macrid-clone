import { onAuthEvent } from "@/lib/auth/events";

/**
 * Copies made by "New conversation" that nobody has used yet. Chat history is
 * stored per agent, so a new conversation is a copy of the agent; an unused copy
 * is deleted when the user leaves it. In memory only: after a reload the copy
 * stays as an ordinary agent.
 */
const unused = new Set<string>();
const pending = new Map<string, ReturnType<typeof setTimeout>>();

export const isUnusedCopy = (id: string) => unused.has(id);

export function markUnused(id: string) {
  unused.add(id);
}

/** Any real use (a message, an edit, a channel) keeps the copy for good. */
export function markUsed(id: string) {
  unused.delete(id);
  cancelDiscard(id);
}

export function cancelDiscard(id: string) {
  clearTimeout(pending.get(id));
  pending.delete(id);
}

/**
 * Deferred by a tick so a view that unmounts and mounts again straight away
 * (React Strict Mode) keeps its copy.
 */
export function scheduleDiscard(id: string, discard: () => void) {
  if (!unused.has(id)) return;
  cancelDiscard(id);
  pending.set(
    id,
    setTimeout(() => {
      pending.delete(id);
      if (!unused.delete(id)) return;
      discard();
    }, 0),
  );
}

onAuthEvent("logout", () => {
  pending.forEach((timer) => clearTimeout(timer));
  pending.clear();
  unused.clear();
});
