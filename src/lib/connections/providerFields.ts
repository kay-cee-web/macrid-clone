import { pickField, toBool, toText } from "@/lib/api/pick";
import type { ConnectorField } from "@/types/connector";

/**
 * Credential fields as a backend `providers` route lists them, shared by
 * /payments/providers and /email-platforms/providers. Neither carries a type,
 * so secret-looking names become password inputs.
 */
type Row = Record<string, unknown>;

/** A list of rows, or an object `{secret_key: "Secret key"}`. */
export function toFields(value: unknown): ConnectorField[] {
  const rows: Row[] = Array.isArray(value)
    ? value.map((v) => (typeof v === "string" ? { name: v } : (v as Row)))
    : Object.entries((value ?? {}) as Row).map(([name, label]) => (typeof label === "object" ? { name, ...(label as Row) } : { name, label }));
  return rows.map((row): ConnectorField => {
    const name = toText(pickField(row, ["name", "key", "field"]));
    const secret = /secret|key|token|password/i.test(name) && !/client_id|api_url/i.test(name);
    return {
      name,
      label: toText(pickField(row, ["label", "title"])) || name.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()),
      type: toText(row.type) === "text" || !secret ? "text" : "password",
      required: toBool(row.required, true),
      placeholder: toText(row.placeholder) || undefined,
      help: toText(pickField(row, ["help", "hint", "description"])) || undefined,
    };
  }).filter((f) => f.name);
}
