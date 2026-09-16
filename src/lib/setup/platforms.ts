import { PLATFORMS, type PlatformId } from "@/data/platforms";
import type { Connections } from "@/types/connector";

/**
 * Whether the workspace is set up for each platform an idea or task touches.
 * ready    something the agent can use is connected
 * shared   works on a Macrid shared resource (SMS sender, Places key)
 * missing  nothing connected, so the agent can draft but not do it
 * unknown  no endpoint says (WhatsApp Business, LinkedIn, Facebook); never blocks
 */
export type SetupState = "ready" | "shared" | "missing" | "unknown";
export type PlatformSetup = { state: SetupState; note: string };
export type WorkspaceSetup = Record<PlatformId, PlatformSetup>;

const connected = (connections: Connections, ...keys: string[]) =>
  keys.some((key) => connections.state[key]?.status === "connected");

export function setupFrom(connections: Connections): WorkspaceSetup {
  const has = (...keys: string[]) => connected(connections, ...keys);
  return {
    email: has("smtp", "gmail", "outlook_mail")
      ? { state: "ready", note: "A mailbox is connected." }
      : { state: "missing", note: "No mailbox is connected. Add SMTP, Gmail or Outlook so the agent can send email." },
    sms: has("twilio")
      ? { state: "ready", note: "Texts go out from your own Twilio sender." }
      : { state: "shared", note: "Texts go out on Macrid's shared sender. Add Twilio to use your own number." },
    whatsapp: { state: "unknown", note: "WhatsApp Business is connected through Meta in Macrid; its status can't be checked here." },
    google_maps: has("google_places")
      ? { state: "ready", note: "Uses your own Google Places key." }
      : { state: "shared", note: "Uses Macrid's shared Google Places key, which has a daily limit." },
    google_business: has("gbp")
      ? { state: "ready", note: "Google Business Profile is connected." }
      : { state: "missing", note: "Connect Google Business Profile so the agent can read your listings." },
    linkedin: { state: "unknown", note: "" },
    facebook: { state: "unknown", note: "" },
  };
}

/** Platforms among `ids` that still need connecting. */
export const missingIn = (setup: WorkspaceSetup | null, ids: PlatformId[]) =>
  setup ? ids.filter((id) => setup[id].state === "missing") : [];

export const platformNames = (ids: PlatformId[]) => ids.map((id) => PLATFORMS[id].name).join(" and ");

/** Words in a task that point at a platform, for the pre-send check in chat. */
const MENTIONS: [PlatformId, RegExp][] = [
  ["email", /\b(e-?mails?|newsletters?|inbox|mailbox)\b/i],
  ["sms", /\b(sms|texts?|text messages?)\b/i],
  ["whatsapp", /\bwhats\s?app\b/i],
  ["google_business", /\bgoogle business( profile)?\b|\bgbp\b/i],
];

export const platformsMentioned = (text: string): PlatformId[] =>
  MENTIONS.filter(([, pattern]) => pattern.test(text)).map(([id]) => id);

/** The task asks for something to go out (not just drafted). */
export const mentionsSending = (text: string) =>
  /\b(send|sends|sending|blast|launch|text them|email them|message them|reach out|follow[- ]?up)\b/i.test(text);
