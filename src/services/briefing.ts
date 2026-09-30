import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { toText } from "@/lib/api/pick";
import { toBriefing } from "@/lib/briefing/normalize";
import type { Briefing, BriefingSettings } from "@/types/briefing";

/**
 * The four `/briefing` routes (live, probed with a token 2026-09-30).
 *
 * Gathering happens server-side in plain SQL and is cached for an hour, so this
 * is a cheap read the screen can make on every open.
 */
type Row = Record<string, unknown>;

const messageOf = (data: unknown, fallback: string) => toText((data as Row)?.message) || fallback;

export type BriefingOptions = {
  /** Skip the hourly cache and gather again. Confirmed: `built_at` moves. */
  refresh?: boolean;
  /**
   * Let the model reorder and reword what SQL already found. It is forbidden
   * from inventing items and a failure leaves the briefing unchanged, so this
   * is safe to omit — and omitting it is the default, since the unpolished
   * briefing is already complete.
   */
  polish?: boolean;
};

export async function fetchBriefing({ refresh, polish }: BriefingOptions = {}): Promise<Briefing> {
  const params = { ...(refresh ? { refresh: 1 } : {}), ...(polish ? { polish: 1 } : {}) };
  const { data } = await api.get("/briefing", { params });
  assertEnvelope(data, "Could not load your briefing");
  return toBriefing(data);
}

/**
 * The push version, as it would arrive on a phone: four lines, no actions,
 * readable on a lock screen. It is **not** the screen truncated — truncating
 * the screen leaves dangling buttons and no shape — so it is fetched rather
 * than derived from `fetchBriefing`.
 *
 * Note the payload sits in **`message`**, which is the one key this API uses
 * for status lines everywhere else. Reading it is deliberate, not a slip.
 */
export async function fetchBriefingMessage(): Promise<string> {
  const { data } = await api.get("/briefing/preview");
  assertEnvelope(data, "Could not load the message version");
  return toText((data as Row)?.message);
}

/** Push the briefing now, to the channel in the user's settings. This really sends. */
export async function sendBriefing(): Promise<string> {
  const { data } = await api.post("/briefing/send", {});
  assertEnvelope(data, "Could not send your briefing");
  return messageOf(data, "Briefing sent.");
}

/**
 * **Always send every field.** The route takes the whole settings object and
 * replaces it — an empty body answers `{status: true, message: "Saved."}`
 * rather than a validation error (probed 2026-09-30), so a partial write
 * silently blanks whatever it left out, the way `/profile-update` does.
 *
 * And nothing reads them back: `GET /briefing` carries no settings block and
 * this route echoes nothing, so the client cannot show what is stored. Until
 * the backend returns them, a settings form would open on defaults and save
 * over the real values — which is why there isn't one yet.
 */
export async function saveBriefingSettings(settings: BriefingSettings): Promise<string> {
  const { data } = await api.post("/briefing/settings", {
    enabled: settings.enabled,
    hour: settings.hour,
    weekdays: settings.weekdays,
    channel: settings.channel,
  });
  assertEnvelope(data, "Could not save your briefing settings");
  return messageOf(data, "Saved.");
}
