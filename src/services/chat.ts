import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { splitAttachments, withAttachments } from "@/lib/agents/attachments";
import { pickList } from "@/lib/api/pick";
import type { ChatImage, ChatMessage, ChatReply } from "@/types/agent";

type MessageRow = { id?: number | string; role?: string; content?: string; created_at?: string };

/** Anything that isn't the user is the agent, so an unknown role never shows as "you". */
const USER_ROLES = ["user", "human"];

function normalizeMessage(row: MessageRow, index: number): ChatMessage {
  const { text, images } = splitAttachments(row.content?.trim() ?? "");
  return {
    id: String(row.id ?? `m-${index}`),
    role: USER_ROLES.includes(String(row.role).toLowerCase()) ? "user" : "assistant",
    text,
    at: row.created_at ?? new Date(0).toISOString(),
    ...(images.length ? { images } : {}),
  };
}

/** The agent's whole thread, oldest first (one thread per agent; no pagination). */
export async function fetchMessages(agentId: string): Promise<ChatMessage[]> {
  const { data } = await api.get(`/agents/${agentId}/messages`);
  assertEnvelope(data, "Could not load the conversation");
  return pickList<MessageRow>(data, "messages")
    .map(normalizeMessage)
    .filter((message) => message.text || message.images?.length);
}

/**
 * One turn: send a message, get the reply. No streaming.
 * `instructions` is set when the agent rewrote its own brief during the turn;
 * the backend has already saved it, so callers update local state without a PUT.
 */
export async function sendChatMessage(
  agentId: string,
  input: { message: string; conversationId?: string; images?: ChatImage[] },
): Promise<ChatReply> {
  const body: Record<string, string> = { message: withAttachments(input.message, input.images) };
  if (input.conversationId) body.conversation_id = input.conversationId;

  const { data } = await api.post(`/agents/${agentId}/chat`, body);
  assertEnvelope(data, "The agent could not answer");

  // `message` on this API is the envelope's status line, never the reply.
  const reply = typeof data?.reply === "string" ? data.reply.trim() : "";
  const updated = data?.instructions_updated === true && typeof data?.instructions === "string";
  return { reply, instructions: updated ? data.instructions : null };
}
