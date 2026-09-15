import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { pickList } from "@/lib/agents/normalize";
import type { ChannelLink, ChannelProvider, ChannelStatus, Pairing } from "@/types/channel";

/**
 * Linking an agent to WhatsApp, Telegram or the browser extension. The agent id
 * is in the path; connect has no body. Every provider answers with a pairing code.
 */
const DEFAULT_EXPIRY_S = 900;
const KEYWORD = "LINK";
/** Rows in these states exist but are not a working link (asking for a code creates a pending row). */
const UNLINKED = ["pending", "expired", "revoked", "failed", "disconnected"];

type Raw = Record<string, unknown> | undefined;

const str = (scope: Raw, ...keys: string[]) => {
  for (const key of keys) {
    const value = scope?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
};

/** wa.me wants digits only. */
const waLink = (number: string, text: string) => {
  const digits = number.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : "";
};

export async function startChannelConnect(agentId: string, provider: ChannelProvider): Promise<Pairing> {
  const { data } = await api.post(`/agents/${agentId}/${provider}/connect`);
  assertEnvelope(data, `Could not start the ${provider} connection`);

  const body: Raw = data?.data && typeof data.data === "object" ? { ...data, ...data.data } : data;
  const code = str(body, "code", "link_code", "pairing_code");
  // The code is the whole mechanism; never invent one.
  if (!code) throw new Error(`${provider} didn't return a pairing code. Try again.`);

  const number = str(body, "number", "send_to", "phone_number");
  const message = `${KEYWORD} ${code}`;
  const deepLink = str(body, "deep_link", "connect_url", "url");
  const expiresIn = Number(body?.expires_in) > 0 ? Number(body?.expires_in) : DEFAULT_EXPIRY_S;

  return {
    code,
    message,
    number,
    bot: str(body, "bot", "bot_username"),
    shortcutUrl: deepLink.startsWith("http") ? deepLink : number ? waLink(number, message) : "",
    instructions: str(body, "instructions", "instruction"),
    expiresIn,
    expiresAt: Date.now() + expiresIn * 1000,
  };
}

/** Never throws: it runs on open and on a timer, where an error toast would be noise. */
export async function fetchChannelStatus(agentId: string, provider: ChannelProvider): Promise<ChannelStatus> {
  try {
    const { data } = await api.get(`/agents/${agentId}/${provider}/status`);
    assertEnvelope(data, "status");
    const links: ChannelLink[] = pickList<Record<string, unknown>>(data, "channels")
      .filter((row) => !UNLINKED.includes(String(row.status ?? "").toLowerCase()))
      .map((row) => ({
        id: str(row, "id", "channel_id"),
        status: str(row, "status") || "active",
        label: str(row, "label", "number", "identifier", "username", "handle"),
        lastMessageAt: str(row, "last_message_at") || null,
      }));
    // The flag decides; a row merely existing never means linked.
    return { connected: data?.connected === true || links.length > 0, links };
  } catch {
    return { connected: false, links: [] };
  }
}

/** Remove one link by its row id. */
export async function disconnectChannel(agentId: string, provider: ChannelProvider, channelId: string) {
  if (!channelId) throw new Error("This link has no id, so it can't be disconnected from here.");
  const { data } = await api.delete(`/agents/${agentId}/${provider}/${channelId}`);
  assertEnvelope(data, `Could not disconnect ${provider}`);
  return typeof data?.message === "string" ? data.message : "";
}
