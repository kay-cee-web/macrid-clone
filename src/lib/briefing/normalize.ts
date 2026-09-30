import { pickField, toBool, toNumber, toText } from "@/lib/api/pick";
import type {
  Briefing,
  BriefingKnow,
  BriefingNeed,
  BriefingPulse,
  BriefingToday,
  BriefingTone,
} from "@/types/briefing";

/**
 * Readers for `GET /briefing`, confirmed against a live reply (2026-09-30):
 *
 * ```
 * {status, greeting, briefing: {
 *   pulse: [{label, value}], needs: [{source, kind, ref, title, body, why, weight}],
 *   needs_more, today: [{time, what, sub}], know: [{tone, text}], empty, built_at}}
 * ```
 *
 * Three things the payload does that the client has to absorb: `ref` is a
 * number (every Laravel id is, and it ends up in URLs and React keys), `tone`
 * is `""` on every row rather than the `warn`/`good` the spec showed, and
 * `built_at` is an ISO string with an offset. A section the backend skips
 * arrives missing rather than empty, so every read is tolerant — a briefing
 * that renders three of its four parts beats one that throws.
 */
type Row = Record<string, unknown>;

const rows = (value: unknown): Row[] => (Array.isArray(value) ? (value as Row[]) : []);

/**
 * Only what the backend actually marks. It sends `""` today, and guessing a
 * tone from the words would put a warning colour on a line nobody classified.
 */
function toTone(value: unknown): BriefingTone {
  const tone = toText(value).toLowerCase();
  if (tone === "warn" || tone === "warning" || tone === "bad") return "warn";
  if (tone === "good" || tone === "ok") return "good";
  return "neutral";
}

function toNeed(row: Row, index: number): BriefingNeed {
  const kind = toText(pickField(row, ["kind", "type"]));
  const ref = toText(pickField(row, ["ref", "id", "record_id"]));
  return {
    // The rows carry no id, so the record it points at is the stable key.
    id: `${kind || "item"}:${ref || index}`,
    source: toText(pickField(row, ["source", "from", "origin"])),
    kind,
    ref,
    title: toText(pickField(row, ["title", "name", "subject"])),
    body: toText(pickField(row, ["body", "detail", "summary"])),
    why: toText(pickField(row, ["why", "reason", "because"])),
    weight: toNumber(pickField(row, ["weight", "score", "rank"])),
  };
}

const toPulse = (row: Row): BriefingPulse => ({
  label: toText(pickField(row, ["label", "name"])),
  value: toNumber(pickField(row, ["value", "count", "total"])),
});

const toToday = (row: Row): BriefingToday => ({
  time: toText(pickField(row, ["time", "at", "start"])),
  what: toText(pickField(row, ["what", "title", "name"])),
  sub: toText(pickField(row, ["sub", "detail", "note", "kind"])),
});

const toKnow = (row: Row): BriefingKnow => ({
  tone: toTone(pickField(row, ["tone", "level"])),
  text: toText(pickField(row, ["text", "body", "message"])),
});

/**
 * `greeting` sits beside `briefing`, not inside it, so the whole envelope comes
 * in here rather than just the inner object.
 */
export function toBriefing(data: unknown): Briefing {
  const envelope = (data ?? {}) as Row;
  const body = (envelope.briefing ?? envelope.data ?? envelope) as Row;
  const needs = rows(pickField(body, ["needs", "urgent"])).map(toNeed);
  const know = rows(pickField(body, ["know", "worth_knowing"])).map(toKnow).filter((item) => item.text);
  const today = rows(pickField(body, ["today", "schedule"])).map(toToday).filter((item) => item.what);
  return {
    greeting: toText(pickField(envelope, ["greeting", "hello"])),
    pulse: rows(pickField(body, ["pulse", "counts"])).map(toPulse).filter((stat) => stat.label),
    needs: needs.filter((need) => need.title),
    needsMore: toNumber(pickField(body, ["needs_more", "needsMore", "more"])),
    today,
    know,
    // Trust the backend's own verdict, and fall back to "did it find anything".
    empty: toBool(
      pickField(body, ["empty", "is_empty"]),
      !needs.length && !today.length && !know.length,
    ),
    builtAt: toText(pickField(body, ["built_at", "builtAt", "generated_at"])),
  };
}
