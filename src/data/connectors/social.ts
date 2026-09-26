import { AtSign, Briefcase, Camera, Music2, Users, Video } from "lucide-react";
import type { Connector } from "@/types/connector";

/**
 * The six platforms an agent can post to (backend doc 2026-09-26). Their ad
 * accounts ride along on the same grant and are read-only, so they get no card
 * of their own.
 *
 * **Consent is one route for all of them** (backend contract, 2026-09-26):
 * `GET /social/redirect?platform=<grant>` → `{status, auth_url}`, and the
 * callback `GET /social/callback/{platform}` closes the popup and posts back
 * the way the Google connector already does. So `fetchOAuthUrl` and
 * `useOAuthPopup` need no social-specific code — it is Google's flow again.
 *
 * **The parameter is the grant, not the platform**: five consent flows for six
 * cards. Meta's single grant covers the Page, the Instagram account linked to
 * it and Meta Ads, so both those cards send `platform=meta` and connecting
 * either one lights up both.
 *
 * `facebook_page` is deliberately not the `facebook` connector: that one is
 * Prospect sources, a different grant for finding pages to contact.
 */
const social = (grant: "meta" | "linkedin" | "x" | "tiktok" | "youtube") =>
  ({ category: "social", store: "social", auth: "oauth", connect: `/social/redirect?platform=${grant}` }) as const;

export const SOCIAL_CONNECTORS: Connector[] = [
  {
    key: "facebook_page", name: "Facebook Page", Icon: Users, logo: "facebook", ...social("meta"),
    description: "Post to your Page and read how it did.",
  },
  {
    key: "instagram", name: "Instagram", Icon: Camera, logo: "instagram", ...social("meta"),
    description: "Post images, reels and carousels.",
  },
  {
    key: "linkedin", name: "LinkedIn", Icon: Briefcase, logo: "linkedin", ...social("linkedin"),
    description: "Publish posts, and find the people behind a company.",
  },
  {
    key: "x", name: "X", Icon: AtSign, logo: "x", ...social("x"),
    description: "Publish posts and threads from your account.",
  },
  {
    key: "youtube", name: "YouTube", Icon: Video, ...social("youtube"),
    description: "Upload videos and read your channel's numbers.",
  },
  {
    key: "tiktok", name: "TikTok", Icon: Music2, logo: "tiktok", ...social("tiktok"),
    description: "Upload short videos with their captions.",
  },
];

/**
 * The backend's spelling of a platform → our connector key. Only Facebook
 * differs, because `facebook` is already the prospecting connector.
 */
const ALIASES: Record<string, string> = {
  facebook: "facebook_page",
  facebook_page: "facebook_page",
  meta: "facebook_page",
  twitter: "x",
};

export const socialKey = (raw: string): string => {
  const flat = raw.trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
  return ALIASES[flat] ?? flat;
};
