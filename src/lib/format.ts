const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const dateOnly = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" });

/** "just now", "5 minutes ago", "yesterday", or a date once it's over a month old. */
export function timeAgo(value: string | null | undefined, now = Date.now()): string {
  if (!value) return "";
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return "";
  // Clock skew can date a row in the future; treat it as now.
  const diff = Math.max(0, now - then);
  if (diff < MINUTE) return "just now";
  if (diff < HOUR) return relative.format(-Math.floor(diff / MINUTE), "minute");
  if (diff < DAY) return relative.format(-Math.floor(diff / HOUR), "hour");
  if (diff < 30 * DAY) return relative.format(-Math.floor(diff / DAY), "day");
  return dateOnly.format(then);
}

/** First name for greetings, from a full name. */
export const firstName = (name?: string | null) => name?.trim().split(/\s+/)[0] ?? "";

/** Up to two initials, for avatar tiles. */
export const initialsOf = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

/** Time-of-day greeting in the viewer's local time. */
export function greetingFor(date = new Date()) {
  const hour = date.getHours();
  if (hour < 5) return "Working late";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
