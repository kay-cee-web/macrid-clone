import type { MetadataRoute } from "next";
import { PRIVATE_PATHS, SITE } from "@/lib/seo/site";

/**
 * Link-preview crawlers get their own group, so a deep link pasted into a chat
 * still unfurls; a bot obeys only the most specific group, so the `*` rules
 * don't reach them. Private pages carry `noindex` as well.
 */
const PREVIEW_BOTS = [
  "facebookexternalhit",
  "Facebot",
  "meta-externalagent",
  "WhatsApp",
  "Twitterbot",
  "LinkedInBot",
  "Slackbot",
  "Slack-ImgProxy",
  "TelegramBot",
  "Discordbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: PREVIEW_BOTS, allow: "/" },
      { userAgent: "*", allow: "/", disallow: [...PRIVATE_PATHS] },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
