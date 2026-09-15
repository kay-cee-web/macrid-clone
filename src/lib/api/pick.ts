/** Helpers for reading loosely shaped Laravel responses. */

/** Laravel booleans arrive as true/false or 1/0. */
export const toBool = (value: unknown, fallback: boolean) =>
  value === undefined || value === null ? fallback : [true, 1, "1", "true"].includes(value as never);

export const toNumber = (value: unknown) => (Number.isFinite(Number(value)) ? Number(value) : 0);

/** A trimmed string, or "" for null, numbers become strings. */
export const toText = (value: unknown) =>
  typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : "";

/** A number when the value is numeric, otherwise null (for "no data" vs 0). */
export const toMaybeNumber = (value: unknown) =>
  value === null || value === undefined || value === "" || !Number.isFinite(Number(value)) ? null : Number(value);

/** The first array found among the usual envelope keys. */
export function pickList<T>(data: unknown, key: string): T[] {
  const d = data as Record<string, unknown> | undefined;
  const nested = d?.data as Record<string, unknown> | undefined;
  const found = [d?.[key], nested?.[key], nested?.data, d?.data, data].find(Array.isArray);
  return (found as T[] | undefined) ?? [];
}

/** The single row out of a create/read/update response. */
export function pickOne<T>(data: unknown, key: string): T {
  const d = data as Record<string, unknown> | undefined;
  return (d?.[key] ?? d?.data ?? d ?? {}) as T;
}
