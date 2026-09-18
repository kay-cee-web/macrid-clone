import { PLAN_FEATURES } from "@/data/plans";
import { toText } from "@/lib/api/pick";
import type { AccountPlan, Allowance, PlanFeatureKey } from "@/types/plan";

const record = (value: unknown) => (value && typeof value === "object" ? (value as Record<string, unknown>) : {});

/** The payload spells booleans "Yes"/"No"; anything else stays unknown. */
function yesNo(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if ([1, "1", "yes", "Yes", "true"].includes(value as never)) return true;
  if ([0, "0", "no", "No", "false"].includes(value as never)) return false;
  return undefined;
}

/**
 * One allowance off a `/package` payload. Two rows don't match the catalogue's
 * shapes and break a straight `pkg[key]`:
 *
 * - `remove_branding` comes back "Yes"/"No", so it would render as "Yes" where
 *   a plan card says "Included".
 * - `reseller` isn't returned at all; the payload carries `num_resells` (a
 *   count), so a straight read shows "—" on an account with resell slots.
 */
function readValue(row: Record<string, unknown>, key: PlanFeatureKey): Allowance | undefined {
  if (key === "remove_branding") return yesNo(row.remove_branding);
  if (key === "reseller") {
    const direct = yesNo(row.reseller);
    if (direct !== undefined) return direct;
    const resells = row.num_resells;
    return resells === undefined || resells === null ? undefined : Number(resells) > 0;
  }
  const value = row[key];
  if (value === null) return null; // unlimited
  if (value === undefined || value === "") return undefined;
  return Number.isFinite(Number(value)) ? Number(value) : undefined;
}

/** `GET /package` → the account's plan. Unreported columns stay absent, never 0. */
export function normalizePackage(data: unknown): AccountPlan {
  const body = record(data);
  const row = Object.keys(record(body.data)).length ? record(body.data) : body;
  const allowances: Partial<Record<PlanFeatureKey, Allowance>> = {};
  for (const { key } of PLAN_FEATURES) {
    const value = readValue(row, key);
    if (value !== undefined) allowances[key] = value;
  }
  return { name: toText(row.name), allowances };
}
