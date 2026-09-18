/**
 * Plans are **one-time lifetime licences**, not subscriptions: no monthly or
 * yearly axis, nothing renews, nothing lapses. Any copy that says "per month"
 * is wrong by construction.
 *
 * Field keys match the backend's `package` columns (`num_emails`, …), so the
 * account's own plan (`GET /package`) can be compared with a catalogue tier
 * field by field without a mapping table.
 */
export type PlanId = "free" | "solo" | "business" | "agency";

export type PlanAllowances = {
  /** `null` = unlimited, `0` = off on that tier. */
  num_emails: number;
  num_whatsapp: number;
  num_sms: number;
  num_email_verifications: number;
  num_funnel_campaigns: number | null;
  num_tokens: number;
  num_lead_search: number;
  num_custom_domains: number;
  num_teams: number;
  remove_branding: boolean;
  reseller: boolean;
};

export type Plan = PlanAllowances & {
  id: PlanId;
  name: string;
  /** US dollars, paid once. 0 is the free tier. */
  price: number;
  tagline: string;
  popular?: boolean;
  /** Checkout link; absent on the free tier, which has nothing to buy. */
  checkout?: string;
};

export type PlanFeatureKey = keyof PlanAllowances;

export type Allowance = number | boolean | null;

/**
 * The account's own plan from `GET /package`. `name` is the backend's own
 * (a test account sits on "Dev package", which is not a public tier), and an
 * allowance the payload doesn't carry is `undefined`, never 0.
 */
export type AccountPlan = {
  name: string;
  allowances: Partial<Record<PlanFeatureKey, Allowance>>;
};
