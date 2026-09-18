import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { normalizePackage } from "@/lib/plans/normalize";
import type { AccountPlan } from "@/types/plan";

/**
 * Plans and licences — the same two routes Macrid's settings/plans uses.
 *
 * There is no checkout in the product and no route that lists the tiers:
 * buying happens on the pricing site, and the buyer redeems the licence code
 * here. Nothing reports CONSUMPTION either (`/usage`, `/token-usage` and the
 * rest all 404), so the panel states allowances, never a spend.
 */
export async function fetchPackage(): Promise<AccountPlan> {
  const { data } = await api.get("/package");
  assertEnvelope(data, "Could not load your plan");
  return normalizePackage(data);
}

/** `POST /upgrade-account` applies a licence code; the server owns the new allowances. */
export async function redeemLicence(code: string): Promise<void> {
  const { data } = await api.post("/upgrade-account", { code: code.trim() });
  assertEnvelope(data, "Could not redeem that code");
}
