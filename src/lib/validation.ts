/** Small, composable validators that return an error message or undefined. */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const required =
  (message: string) =>
  (value: string | boolean) =>
    (typeof value === "boolean" ? value : value.trim()) ? undefined : message;

export const email = (value: string) =>
  !value.trim() ? "Enter your email address." : EMAIL.test(value.trim()) ? undefined : "That email address doesn't look right.";

export const minLength =
  (length: number, message: string) =>
  (value: string) =>
    value.length >= length ? undefined : message;

export const password = (value: string) =>
  !value ? "Enter a password." : minLength(8, "Use at least 8 characters.")(value);

/** Map Laravel's snake_case validation keys onto form field names. */
export function mapFieldErrors<T extends string>(
  errors: Record<string, string>,
  mapping: Partial<Record<string, T>>,
): Partial<Record<T, string>> {
  const out: Partial<Record<T, string>> = {};
  for (const [key, message] of Object.entries(errors)) {
    const field = mapping[key] ?? (key as T);
    if (message && !out[field]) out[field] = message;
  }
  return out;
}
