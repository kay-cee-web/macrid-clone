/** Figures for one account or campaign over the chosen period. `null` = not reported. */
export type AdTotals = {
  spend: number | null;
  impressions: number | null;
  clicks: number | null;
  /** As the backend words it ("0%"). */
  ctr: string;
  cpc: number | null;
};

/** Campaign rows haven't been seen yet (every account had none, 2026-10-29), so they're read loosely. */
export type AdCampaign = { id: string; name: string; status: string; totals: AdTotals };

export type AdAccountOverview = {
  id: string;
  /** `meta_ads`, `google_ads`… — keys of `AD_PLATFORMS`. */
  platform: string;
  name: string;
  currency: string;
  active: boolean;
  /** The backend's reason this account couldn't be read, or "". */
  error: string;
  period: string;
  totals: AdTotals;
  campaigns: AdCampaign[];
};

export type AdsOverview = { from: string; to: string; accounts: AdAccountOverview[] };
