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

const dateTime = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
const compact = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });

/** "12 Sep 2026", or "" for missing and invalid dates. */
export function formatDate(value: string | null | undefined): string {
  const time = value ? new Date(value).getTime() : NaN;
  return Number.isNaN(time) ? "" : dateOnly.format(time);
}

/** "12 Sep, 3:30 PM" in the viewer's time zone. */
export function formatDateTime(value: string | null | undefined): string {
  const time = value ? new Date(value).getTime() : NaN;
  return Number.isNaN(time) ? "" : dateTime.format(time);
}

/** Plain number with up to 2 decimals; currency is unknown on Macrid rows. */
export const formatAmount = (value: number | null) => (value === null ? "" : compact.format(value));

/** "42%" from 42 or "42.5"; "" when there is no rate yet. */
export const formatPercent = (value: number | null) => (value === null ? "" : `${compact.format(value)}%`);

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
