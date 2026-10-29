/** The periods a records page offers, in days back from today. */
export const RANGE_PRESETS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "365", label: "Last 12 months" },
];

const ymd = (date: Date) => date.toISOString().slice(0, 10);

/** `{from, to}` as YYYY-MM-DD — the only form the backend parses safely. */
export function rangeFor(days: string) {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - Number(days));
  return { from: ymd(from), to: ymd(to) };
}

/** Money in the account's own currency; a bare number when the code isn't one Intl knows. */
export function formatMoney(value: number | null, currency: string) {
  if (value === null) return "";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: currency || "USD" }).format(value);
  } catch {
    return `${value.toLocaleString()} ${currency}`.trim();
  }
}
