import type { Metadata } from "next";
import { DEXISPHERE_APP_URL } from "@/lib/config";

/** One place for what search engines and link previews read. */
export const SITE = {
  /** This app's canonical origin. There is no www host to redirect from. */
  url: DEXISPHERE_APP_URL,
  name: "Dexisphere Agents",
  shortName: "Dexisphere",
  title: "Dexisphere Agents · AI agents that do your sales busywork",
  description:
    "Hand a task to an AI agent and it does the work: finds leads, runs outreach, keeps your CRM current and shows a receipt for every change. Free forever plan.",
  locale: "en_US",
  /** `--ground` in each theme, so the browser chrome matches the page. */
  themeColor: { light: "#f7f8fc", dark: "#050816" },
} as const;

/** The only pages worth a search result: everything else needs an account. */
export const PUBLIC_PATHS = ["/", "/login", "/register"] as const;

/** Signed-in sections and the auth steps nobody should land on from a search. */
export const PRIVATE_PATHS = [
  "/agents",
  "/records",
  "/settings",
  "/briefing",
  "/meetings",
  "/notes",
  "/forgot-password",
  "/email-verify",
] as const;

export const NOINDEX: Metadata["robots"] = { index: false, follow: false };

/** Stated, not omitted: the signed-in layout sets NOINDEX, and home has to undo it. */
export const INDEX: Metadata["robots"] = { index: true, follow: true };

/**
 * The link-preview card, made by `scripts/brand-images.mjs`. Not the
 * `opengraph-image` file convention: a segment that sets its own `openGraph`
 * drops the root's file-based image, so every page re-includes this instead.
 */
export const SHARE_IMAGE = {
  url: "/image/share-card.jpg",
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "Dexisphere Agents: Your agent works. You don't have to.",
};

export const SHARED_OPEN_GRAPH = {
  type: "website",
  siteName: SITE.name,
  locale: SITE.locale,
  images: [SHARE_IMAGE],
} satisfies Metadata["openGraph"];

export const SHARED_TWITTER = {
  card: "summary_large_image",
  images: [SHARE_IMAGE],
} satisfies Metadata["twitter"];

type PageSeo = {
  title: string;
  description: string;
  /** Static path for the canonical and og:url; leave out on dynamic routes. */
  path?: string;
  /** Only the public pages are indexed. */
  index?: boolean;
};

/**
 * Title, description, canonical and the share fields for one page. Next merges
 * metadata shallowly, so `openGraph` and `twitter` are built whole here rather
 * than half-inherited from the root layout.
 */
export function pageMetadata({ title, description, path, index = false }: PageSeo): Metadata {
  return {
    title,
    description,
    ...(path && { alternates: { canonical: path } }),
    openGraph: { ...SHARED_OPEN_GRAPH, title, description, ...(path && { url: path }) },
    twitter: { ...SHARED_TWITTER, title, description },
    robots: index ? INDEX : NOINDEX,
  };
}
