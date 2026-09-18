import type { Plan, PlanFeatureKey } from "@/types/plan";

/**
 * The four tiers, transcribed from dexisphere.com's pricing page (kept in step
 * with the landing site's `src/data/plans.ts`).
 *
 * **Hardcoded, and not by choice.** `GET /package` returns only the plan the
 * account is ON; `/packages` and `/plans` both 404, so nothing lists the tiers.
 * If marketing changes a number, nothing here notices — whoever edits the
 * pricing page edits this file too. Where the two disagree, `/package` is right
 * about the account and this file is only about what's for sale.
 *
 * **Order is the ladder, cheapest first.** "Everything in X" and the
 * upgrade/downgrade split both read it by index, so re-ordering changes which
 * tiers count as an upgrade. Every tier is a superset of the one below it.
 */
export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free Forever",
    price: 0,
    tagline: "Try Dexisphere with no commitment.",
    remove_branding: false,
    reseller: false,
    num_teams: 0,
    num_emails: 5,
    num_whatsapp: 10,
    num_sms: 10,
    num_funnel_campaigns: 1,
    num_tokens: 500,
    num_custom_domains: 0,
    num_lead_search: 25,
    num_email_verifications: 100,
  },
  {
    id: "solo",
    name: "Solo",
    price: 59,
    tagline: "For solopreneurs and small campaigns.",
    checkout: "https://macrid.lemonsqueezy.com/checkout/buy/cc9a4774-9ece-458a-99e6-f4852fa62824",
    remove_branding: true,
    reseller: false,
    num_teams: 1,
    num_emails: 5000,
    num_whatsapp: 1000,
    num_sms: 1000,
    num_funnel_campaigns: 10,
    num_tokens: 10000,
    num_custom_domains: 2,
    num_lead_search: 1000,
    num_email_verifications: 10000,
  },
  {
    id: "business",
    name: "Business",
    price: 129,
    tagline: "For growing businesses and power users.",
    popular: true,
    checkout: "https://macrid.lemonsqueezy.com/checkout/buy/38d3c94d-41b3-47db-bd3c-b8a8bbb00c12",
    remove_branding: true,
    reseller: true,
    num_teams: 5,
    num_emails: 25000,
    num_whatsapp: 10000,
    num_sms: 10000,
    num_funnel_campaigns: 50,
    num_tokens: 50000,
    num_custom_domains: 10,
    num_lead_search: 15000,
    num_email_verifications: 25000,
  },
  {
    id: "agency",
    name: "Agency",
    price: 249,
    tagline: "For agencies running campaigns at scale.",
    checkout: "https://macrid.lemonsqueezy.com/checkout/buy/5deef1ed-78df-4411-bd6f-1161f957fc20",
    remove_branding: true,
    reseller: true,
    num_teams: 20,
    num_emails: 60000,
    num_whatsapp: 25000,
    num_sms: 25000,
    num_funnel_campaigns: null,
    num_tokens: 100000,
    num_custom_domains: 50,
    num_lead_search: 60000,
    num_email_verifications: 60000,
  },
];

/** Every allowance, in the order the pricing page lists them. */
export const PLAN_FEATURES: { key: PlanFeatureKey; label: string }[] = [
  { key: "num_emails", label: "Email campaigns" },
  { key: "num_whatsapp", label: "WhatsApp campaigns" },
  { key: "num_sms", label: "SMS campaigns" },
  { key: "num_funnel_campaigns", label: "Funnel campaigns" },
  { key: "num_tokens", label: "AI tokens" },
  { key: "num_lead_search", label: "Lead searches" },
  { key: "num_email_verifications", label: "Email verifications" },
  { key: "num_teams", label: "Team members" },
  { key: "num_custom_domains", label: "Custom domains" },
  { key: "remove_branding", label: "Remove branding" },
  { key: "reseller", label: "Reseller access" },
];

/** The six a plan card lists, with their mid-sentence wording. */
export const CARD_FEATURES: { key: PlanFeatureKey; phrase: string }[] = [
  { key: "num_tokens", phrase: "AI tokens" },
  { key: "num_emails", phrase: "email campaigns" },
  { key: "num_whatsapp", phrase: "WhatsApp campaigns" },
  { key: "num_sms", phrase: "SMS campaigns" },
  { key: "num_lead_search", phrase: "lead searches" },
  { key: "num_funnel_campaigns", phrase: "funnel campaigns" },
];

/** The four shown as tiles for the account's own plan. */
export const SUMMARY_KEYS: PlanFeatureKey[] = ["num_tokens", "num_emails", "num_lead_search", "num_whatsapp"];

/** Comparison-table groups. Every PLAN_FEATURES key appears exactly once. */
export const COMPARISON_GROUPS: { title: string; keys: PlanFeatureKey[] }[] = [
  { title: "Outreach", keys: ["num_emails", "num_whatsapp", "num_sms", "num_email_verifications"] },
  { title: "Growth", keys: ["num_funnel_campaigns", "num_lead_search", "num_custom_domains"] },
  { title: "AI", keys: ["num_tokens"] },
  { title: "Team and brand", keys: ["num_teams", "remove_branding", "reseller"] },
];
