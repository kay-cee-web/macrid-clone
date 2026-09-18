import { PLANS, PLAN_FEATURES } from "@/data/plans";
import type { AccountPlan, Allowance, Plan, PlanFeatureKey } from "@/types/plan";

/** Plan and billing lives in the settings page, not in the Dexisphere app. */
export const PLAN_HREF = "/settings?section=plan";

/** `null` = unlimited, `0`/false = off on this tier, `undefined` = not reported. */
export function formatAllowance(value: Allowance | undefined): string {
  if (value === undefined) return "—";
  if (value === null) return "Unlimited";
  if (typeof value === "boolean") return value ? "Included" : "Not included";
  return value.toLocaleString("en-US");
}

export const labelOf = (key: PlanFeatureKey) => PLAN_FEATURES.find((f) => f.key === key)?.label ?? key;

/**
 * Match what `/package` returned against the catalogue, **by name and allowed
 * to fail**: the backend's package names are its own (a test account sits on
 * "Dev package"). No match is not an error — the account still sees its real
 * allowances, and no card is marked "Your plan".
 */
export function matchPlan(packageName: string | undefined): Plan | null {
  const name = (packageName ?? "").trim().toLowerCase();
  if (!name) return null;
  return (
    PLANS.find((plan) => plan.name.toLowerCase() === name) ??
    PLANS.find((plan) => name.includes(plan.id)) ??
    null
  );
}

/** Position on the ladder, or -1 when the account's plan isn't a public tier. */
export const planIndex = (plan: Plan | null) => (plan ? PLANS.findIndex((p) => p.id === plan.id) : -1);

/**
 * The value to show for one allowance: the account's own when `/package`
 * reported it, otherwise the matched tier's. Falls back to `undefined` (a dash)
 * rather than inventing a zero — a column we can't read is not a feature that's
 * switched off.
 */
export function allowanceOf(account: AccountPlan | null, plan: Plan | null, key: PlanFeatureKey): Allowance | undefined {
  const own = account?.allowances[key];
  return own !== undefined ? own : plan?.[key];
}
