import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { pickList, pickOne, toText } from "@/lib/api/pick";
import { toConnection, toProvider } from "@/lib/workTools/normalize";
import type { WorkToolConnection, WorkToolProvider } from "@/types/workTool";

/**
 * /work-tools owns Slack, Telegram channels, Jira, GitHub and Shopify (backend
 * doc 2026-09-30). Credentials are tested before saving and encrypted at rest;
 * for Slack and Telegram the test *is* a message, so connecting one posts a
 * visible hello to the channel.
 *
 * Not deployed yet — see the note in `data/connectors/workTools.ts`.
 */
type Row = Record<string, unknown>;

const messageOf = (data: unknown, fallback: string) => toText((data as Row)?.message) || fallback;

/** What the agent can post to or watch, with each one's credential fields. */
export async function fetchWorkToolProviders(): Promise<WorkToolProvider[]> {
  const { data } = await api.get("/work-tools/providers");
  assertEnvelope(data, "Could not load the work tools");
  const list = pickList<Row>(data, "providers");
  if (list.length) return list.map((row) => toProvider(row));
  return Object.entries(pickOne<Row>(data, "providers"))
    .filter(([, value]) => value && typeof value === "object")
    .map(([key, value]) => toProvider(value as Row, key));
}

/**
 * The rows sit under `connections`, like the confirmed siblings — unverified,
 * see the note in `lib/workTools/normalize.ts`. A failure throws and names
 * itself on the Plugins page rather than being swallowed: the routes are live
 * now, so a 404 here would be a regression worth seeing.
 */
export async function fetchWorkTools(): Promise<WorkToolConnection[]> {
  const { data } = await api.get("/work-tools");
  assertEnvelope(data, "Could not read your work tools");
  return pickList<Row>(data, "connections").map(toConnection);
}

/** A watcher saved with no notify channel is rejected, so `notifyChannel` is required for one. */
export type WorkToolSetup = {
  credentials: Record<string, string>;
  /** Watch only: which events to report. The backend defaults to the first. */
  watch?: string[];
  /** Watch only: where reports go. */
  notifyChannel?: string;
  everyMinutes?: number;
};

const bodyOf = ({ watch, notifyChannel, everyMinutes }: WorkToolSetup): Row => ({
  ...(watch?.length ? { watch } : {}),
  ...(notifyChannel ? { notify_channel: notifyChannel } : {}),
  ...(everyMinutes ? { every_minutes: everyMinutes } : {}),
});

/** The credentials are tested before they're saved, and never returned. */
export async function connectWorkTool(provider: string, setup: WorkToolSetup, name: string) {
  const { data } = await api.post("/work-tools", { provider, credentials: setup.credentials, ...bodyOf(setup) });
  assertEnvelope(data, `Could not connect ${name}`);
  return messageOf(data, `${name} connected.`);
}

/** What it watches, where it reports and how often — not the credentials. */
export async function updateWorkTool(id: string, setup: WorkToolSetup, name: string) {
  const { data } = await api.put(`/work-tools/${id}`, bodyOf(setup));
  assertEnvelope(data, `Could not update ${name}`);
  return messageOf(data, `${name} updated.`);
}

/**
 * Look now, without waiting for the next poll. This is the UI's half of
 * `check_work_tool`, which deliberately doesn't move the cursor: asking what's
 * on your plate shouldn't silence the watcher for items you haven't dealt with.
 */
export async function checkWorkToolNow(id: string, name: string) {
  const { data } = await api.post(`/work-tools/${id}/check`, {});
  assertEnvelope(data, `Could not check ${name}`);
  return messageOf(data, `Checked ${name}.`);
}

/**
 * Speak only: post to Slack or a Telegram channel. The body field is **`text`**,
 * not `message` (confirmed 2026-09-30 — `message` alone answers 422 "The text
 * field is required"), which is worth knowing because `message` is what comes
 * *back* on every one of these routes.
 */
export async function postToChannel(id: string, text: string, name: string) {
  const { data } = await api.post(`/work-tools/${id}/post`, { text });
  assertEnvelope(data, `Could not post to ${name}`);
  return messageOf(data, `Posted to ${name}.`);
}

/**
 * A missing row answers **HTTP 200** with `{status: false, message: "Connection
 * not found."}` (the sibling routes 404 for the same thing), so the envelope
 * check is what catches it rather than the status code.
 */
export async function disconnectWorkTool(id: string, name: string) {
  const { data } = await api.delete(`/work-tools/${id}`);
  assertEnvelope(data, `Could not disconnect ${name}`);
  return messageOf(data, `${name} disconnected.`);
}
