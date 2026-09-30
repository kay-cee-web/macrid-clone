import type { Connector } from "@/types/connector";

/**
 * Connectors a workflow already needs that have no route of any kind yet — not
 * even one that fails. Plugins lists them under "Others", where Connect toasts
 * "work in progress" rather than opening a form that can't submit. A platform
 * whose routes exist but don't work yet does **not** belong here: build it
 * properly so its errors surface, the way `social.ts` does. Building one of
 * these means giving it its real `category`, `auth` and routes, like the rest.
 */
export const PLANNED_CONNECTORS: Connector[] = [
  // LinkedIn, X, Instagram and TikTok moved to `social.ts`: the backend has
  // routes for them now, so they have their own section. They stay `planned`
  // there until a consent flow exists to click.
  //
  // Slack, Telegram channels, Jira, GitHub and Shopify moved to `workTools.ts`
  // and went live the same day: their own group, Work tools, with real key
  // forms. Five connectors with one backend doc are a family, and "Others" said
  // nothing about what they do.
  //
  // So this shelf is empty. It stays for the next connector a workflow needs
  // before the backend has anything to call.
  //
  // A bank and an image tool were here. Neither is a connection the user makes:
  // there's no bank integration to build against, and images are the agent's
  // own job. Their workflows stay `blocked`, which reads "Not available"
  // without promising a card to click. Email verification went too — the
  // backend verifies addresses itself (`verify_emails`), so there was nothing
  // to connect.
];
