import { CONNECTORS_BY_KEY } from "@/data/connectors";
import { PLATFORMS, type PlatformId } from "@/data/platforms";
import type { Connections } from "@/types/connector";

/**
 * Whether the workspace is set up for each platform an idea or task touches.
 * ready    something the agent can use is connected
 * shared   works on a Macrid shared resource (SMS sender, Places key)
 * missing  nothing connected, so the agent can draft but not do it
 * attention connected but broken (expired token, revoked password…); treated as missing
 * unknown  no endpoint says (WhatsApp Business); never blocks
 * planned  no connector exists yet (LinkedIn, Slack…); never blocks either
 */
export type SetupState = "ready" | "shared" | "missing" | "attention" | "unknown" | "planned";
/** `connector` stands for the platform on cards: the connected one, else the usual one. */
export type PlatformSetup = { state: SetupState; note: string; connector: string };
export type WorkspaceSetup = Record<PlatformId, PlatformSetup>;

/** Where nothing connected isn't "missing": there's a shared fallback, or no way to check. */
const IDLE: Partial<Record<PlatformId, SetupState>> = {
  sms: "shared", google_maps: "shared", whatsapp: "unknown",
};

const NOTES: Partial<Record<PlatformId, Partial<Record<SetupState, string>>>> = {
  email: {
    ready: "The agent has an address to send from.",
    missing: "Nothing is connected to send from. Add Gmail, Outlook or SMTP so the agent can send email.",
  },
  inbox: {
    ready: "The agent can read your mail.",
    missing: "Add a mailbox so the agent can read your mail. Gmail connected for sending doesn't give it read access.",
  },
  sms: {
    ready: "Texts go out from your own Twilio sender.",
    shared: "Texts go out on Dexisphere's shared sender. Add Twilio to use your own number.",
  },
  whatsapp: { unknown: "WhatsApp Business is connected through Meta in Dexisphere; its status can't be checked here." },
  facebook: { missing: "Connect Facebook so the agent can read the pages you manage." },
  google_maps: {
    ready: "Uses your own Google Places key.",
    shared: "Uses Dexisphere's shared Google Places key, which has a daily limit.",
  },
  google_business: { missing: "Connect Google Business Profile so the agent can read your listings." },
  calendar: { missing: "Connect Google Calendar or Outlook so the agent can book and check your schedule." },
  payments: {
    ready: "The agent can read your payment accounts.",
    missing: "Connect Stripe, PayPal or another payment account so the agent can read your sales.",
    attention: "Your payment account has stopped working. Open it in Plugins to fix it.",
  },
};

const GENERIC_NOTE: Record<SetupState, (name: string) => string> = {
  ready: (name) => `${name} is connected.`,
  shared: (name) => `${name} runs on Dexisphere's shared account.`,
  missing: (name) => `Connect ${name} so the agent can use it.`,
  attention: (name) => `${name} is connected but has stopped working. Reconnect it in Plugins.`,
  unknown: (name) => `${name}'s status can't be checked here.`,
  planned: (name) => `Nothing connects ${name} yet. It's on the list to build.`,
};

function platformSetup(id: PlatformId, connections: Connections): PlatformSetup {
  const { name, connectors } = PLATFORMS[id];
  const live = connectors.find((key) => connections.state[key]?.status === "connected");
  const broken = connectors.find((key) => connections.state[key]?.status === "attention");
  const planned = CONNECTORS_BY_KEY[connectors[0]]?.auth === "planned";
  const state: SetupState = planned ? "planned" : live ? "ready" : broken ? "attention" : IDLE[id] ?? "missing";
  return { state, connector: live ?? broken ?? connectors[0], note: NOTES[id]?.[state] ?? GENERIC_NOTE[state](name) };
}

export function setupFrom(connections: Connections): WorkspaceSetup {
  const ids = Object.keys(PLATFORMS) as PlatformId[];
  return Object.fromEntries(ids.map((id) => [id, platformSetup(id, connections)])) as WorkspaceSetup;
}

/** Platforms among `ids` that still need connecting. */
export const missingIn = (setup: WorkspaceSetup | null, ids: PlatformId[]) =>
  setup ? ids.filter((id) => setup[id].state === "missing" || setup[id].state === "attention") : [];

export const platformNames = (ids: PlatformId[]) => ids.map((id) => PLATFORMS[id].name).join(" and ");

/** Words in a task that point at a platform, for the pre-send check in chat. */
const MENTIONS: [PlatformId, RegExp][] = [
  ["email", /\b(e-?mails?|newsletters?)\b/i],
  ["inbox", /\b(inbox|mailbox|unread)\b/i],
  ["sms", /\b(sms|texts?|text messages?)\b/i],
  ["whatsapp", /\bwhats\s?app\b/i],
  ["google_business", /\bgoogle business( profile)?\b|\bgbp\b/i],
  ["payments", /\b(stripe|paypal|paystack|flutterwave|paddle|lemon ?squeezy)\b/i],
];

export const platformsMentioned = (text: string): PlatformId[] =>
  MENTIONS.filter(([, pattern]) => pattern.test(text)).map(([id]) => id);

/** The task asks for something to go out (not just drafted). */
export const mentionsSending = (text: string) =>
  /\b(send|sends|sending|blast|launch|text them|email them|message them|reach out|follow[- ]?up)\b/i.test(text);
