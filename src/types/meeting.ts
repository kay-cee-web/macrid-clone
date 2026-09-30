/**
 * Meeting notes (backend doc 2026-09-30). A notetaker bot joins the call,
 * records it, and the transcript comes back as a summary, a note and tasks for
 * the user's own action items.
 *
 * Two things shape every screen here. It is the only feature where one click
 * creates a third-party bill by the minute, so the cost is always stated before
 * the bot is sent. And it is the only feature that records people who never
 * agreed to anything with us, so the bot is named, visible in the participant
 * list, and never silent — there is no option to hide it and there must not be.
 */
export type MeetingStatus =
  /** A bot is booked but the call hasn't started. The only state that can be cancelled. */
  | "scheduled"
  | "joining"
  | "recording"
  /** Transcribed and summarised. Notes are readable. */
  | "done"
  | "failed"
  | "cancelled";

/**
 * A row from `GET /meetings`, confirmed 2026-09-30:
 * `{id, title, service, status, note, when, minutes, tokens, people, summary, actions}`.
 * Note the spellings — `service` not `platform`, `when` not `starts_at`,
 * `people` as a count, and `actions` as a **count**, not a list.
 */
export type Meeting = {
  id: string;
  title: string;
  /** The Zoom, Meet or Teams link the bot was pointed at. */
  joinUrl: string;
  /** The backend's own wording: "Google Meet", "Zoom", "Teams". */
  service: string;
  /** ISO, or "" for a bot sent to join immediately. */
  startsAt: string;
  status: MeetingStatus;
  /** Actual recorded minutes, which is what gets charged — not the booked length. */
  minutes: number | null;
  /** Tokens actually charged, once the call is over. */
  tokens: number | null;
  /** How many were on the call. The API sends a count, not names. */
  people: number | null;
  /** A short write-up, when one comes back on the row. The full note goes to `dexi_notes`. */
  summary: string;
  /** How many action items became tasks. A count — the text lives in the note. */
  actionCount: number;
  recordingUrl: string;
  /** Why it failed — a bot that couldn't join, a transcript that didn't arrive. */
  problem: string;
};

/**
 * What's left of the monthly free allowance, which is the figure that tells a
 * user whether the next call is free.
 *
 * `GET /meetings` sends it as `free: {used, total, left}` in minutes (confirmed
 * 2026-09-30). `tokensPerHour` is **not** sent, so the price of a call past the
 * allowance is left unstated rather than guessed — every field here is optional
 * for that reason.
 */
export type MeetingAllowance = {
  freeMinutesLeft: number | null;
  freeMinutesTotal: number | null;
  freeMinutesUsed: number | null;
  /** Tokens per recorded hour once the free minutes are gone. */
  tokensPerHour: number | null;
};
