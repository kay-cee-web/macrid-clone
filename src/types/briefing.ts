/**
 * "For you" — the daily briefing (backend doc + routes live 2026-09-30).
 *
 * The point is not to gather everything, it's to refuse to show most of it: one
 * loud section capped at six items, ranked by what goes wrong if it's ignored
 * today, each carrying its own reason for being there. `Today` is a schedule and
 * `know` is FYI — if all three read as equally urgent this is just a second
 * inbox, which is the thing the user was already ignoring.
 *
 * Gathering is plain SQL on the backend, so nothing here can be hallucinated and
 * the numbers are the account's own.
 */

/** Ranked by consequence: unanswered reply 90+, meeting within 3h 85, stalled deal 70+, overdue task 40+. */
export type BriefingNeed = {
  /** `kind:ref`. The rows carry no id of their own, and this is stable across reloads. */
  id: string;
  /** Where it came from, shown as a pill: "Inbox", "Tasks", "Deals", "Jira". */
  source: string;
  /** What it is. Decides where the item's link goes — see `lib/briefing/links.ts`. */
  kind: string;
  /** The record's own id. A Laravel number, kept as a string for URLs and keys. */
  ref: string;
  title: string;
  body: string;
  /**
   * Why it's here *today*: "2 days, no reply", "expires Friday". Without it the
   * user reconstructs the urgency themselves, which is the work they came to
   * avoid — so it is never dropped from the card, however tight the space.
   */
  why: string;
  weight: number;
};

/** A count on the strip across the top: `{label: "new leads", value: 43}`. */
export type BriefingPulse = { label: string; value: number };

/** A line in the schedule. `time` is already formatted ("11:00") or "" for an all-day item. */
export type BriefingToday = { time: string; what: string; sub: string };

/**
 * The backend sends `""` on every row today, so everything reads neutral until
 * it starts marking them. Never inferred from the text — a guess at what counts
 * as a warning is exactly the kind of thing the user would learn to distrust.
 */
export type BriefingTone = "neutral" | "warn" | "good";

export type BriefingKnow = { tone: BriefingTone; text: string };

export type Briefing = {
  /** The backend's own line, already personalised: "Good morning, Evan". */
  greeting: string;
  pulse: BriefingPulse[];
  /** At most six. Anything past that is counted in `needsMore`, not listed. */
  needs: BriefingNeed[];
  /** How many ranked below the cap. Shown as a count, never expanded here. */
  needsMore: number;
  today: BriefingToday[];
  know: BriefingKnow[];
  /**
   * Nothing needed the user. This is the success case, not a failure to gather:
   * an assistant that finds four urgent things every morning is justifying
   * itself rather than reading the data.
   */
  empty: boolean;
  /** When it was assembled. The read is cached hourly, so this can be an hour old. */
  builtAt: string;
};

/**
 * The push schedule, stored as JSON in `users.briefing_settings`.
 *
 * **Nothing reads these back.** `GET /briefing` returns no settings block and
 * `POST /briefing/settings` answers `{status, message: "Saved."}` with no echo,
 * so the client cannot show what is actually stored — see the warning on
 * `saveBriefingSettings`.
 */
export type BriefingSettings = {
  enabled: boolean;
  /** Hour of the day in the user's own timezone, 0–23. The scheduler defaults to 8. */
  hour: number;
  /** Skip Saturday and Sunday. */
  weekdays: boolean;
  /** Where the push goes: "whatsapp", "telegram", "slack". */
  channel: string;
};
