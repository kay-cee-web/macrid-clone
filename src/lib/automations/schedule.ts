import type { Automation } from "@/types/automation";

/** `day_of_week` as the backend writes it: 1 is Monday (seen), 0 or 7 Sunday. */
export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const num = (value: unknown): number | null =>
  value === null || value === undefined || value === "" || !Number.isFinite(Number(value)) ? null : Number(value);

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "09:00 UTC". The stored hour is UTC: a task set for 09:00 came back with
 * `next_run_at` 09:00Z, so the label says so rather than passing it off as local time.
 */
export function timeOf(schedule: Record<string, unknown>): string {
  const hour = num(schedule.hour);
  return hour === null ? "" : `${pad(hour)}:${pad(num(schedule.minute) ?? 0)} UTC`;
}

const ordinal = (n: number) => {
  const tail = n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] ?? "th";
  return `${n}${tail}`;
};

/** "Mondays at 09:00 UTC", "Daily at 07:30 UTC". Keys we haven't seen are read tolerantly. */
export function describeSchedule({ scheduleType, schedule }: Automation): string {
  const at = timeOf(schedule);
  const suffix = at ? ` at ${at}` : "";
  if (scheduleType === "daily") return `Daily${suffix}`;
  if (scheduleType === "weekly") {
    const day = num(schedule.day_of_week);
    return day === null ? `Weekly${suffix}` : `${WEEKDAYS[day % 7]}s${suffix}`;
  }
  if (scheduleType === "monthly") {
    const day = num(schedule.day_of_month ?? schedule.day);
    return `Monthly${day === null ? "" : ` on the ${ordinal(day)}`}${suffix}`;
  }
  if (scheduleType === "interval") {
    const minutes = num(schedule.minutes ?? schedule.interval_minutes);
    const hours = num(schedule.hours);
    if (hours) return `Every ${hours} hour${hours === 1 ? "" : "s"}`;
    if (minutes) return `Every ${minutes} minute${minutes === 1 ? "" : "s"}`;
    return "On a repeat";
  }
  return scheduleType || "Scheduled";
}

const NEXT = new Intl.DateTimeFormat(undefined, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/** The next run in the viewer's own time, from `next_run_at`. */
export function nextRunLabel(value: string): string {
  const date = new Date(value);
  return value && !Number.isNaN(date.getTime()) ? NEXT.format(date) : "";
}
