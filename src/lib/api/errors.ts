import { isAxiosError } from "axios";

type Envelope = {
  status?: boolean;
  success?: boolean;
  message?: unknown;
  error?: unknown;
  errors?: Record<string, unknown>;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const nonEmpty = (value: unknown): string =>
  typeof value === "string" && value.trim() ? value.trim() : "";

/** First message out of a Laravel validation bag: { field: ["msg"] }. */
export function firstFieldError(errors: unknown): string {
  if (!isRecord(errors)) return "";
  for (const messages of Object.values(errors)) {
    const list = Array.isArray(messages) ? messages : [messages];
    const found = list.map(nonEmpty).find(Boolean);
    if (found) return found;
  }
  return "";
}

/** Field → first message, for showing validation errors under inputs. */
export function fieldErrors(err: unknown): Record<string, string> {
  const errors = isAxiosError(err) ? err.response?.data?.errors : undefined;
  if (!isRecord(errors)) return {};
  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [
      field,
      nonEmpty(Array.isArray(messages) ? messages[0] : messages),
    ]),
  );
}

/**
 * The most specific human-readable reason a request failed.
 * Order: plain string body → validation field → app `error` → `message`.
 */
export function extractApiError(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const body: unknown = err.response?.data;
    const plain = nonEmpty(body);
    if (plain && !plain.startsWith("<")) return plain;
    if (isRecord(body)) {
      const reason =
        firstFieldError(body.errors) || nonEmpty(body.error) || nonEmpty(body.message);
      if (reason) return reason;
    }
    if (err.response?.status) return `${fallback} (HTTP ${err.response.status})`;
    return err.message || fallback;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

/** Out of AI tokens: a plan limit (upgrade), not a failure worth retrying as is. */
export const isTokenExhausted = (text: string) => /run out of token/i.test(text);

/**
 * This API can answer a failure inside a 200: `{ status: false, errors }`.
 * Throws so callers handle it like any other failed request.
 */
export function assertEnvelope<T>(data: T, fallback: string): T {
  const envelope = data as Envelope;
  if (isRecord(envelope) && (envelope.status === false || envelope.success === false)) {
    throw new Error(
      firstFieldError(envelope.errors) || nonEmpty(envelope.message) || fallback,
    );
  }
  return data;
}
