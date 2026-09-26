import { GitPullRequest, Hash, ImagePlus, Landmark, MailCheck, Megaphone, ShoppingBag, Ticket } from "lucide-react";
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
  {
    // Posting to a channel the user runs; chatting with an agent is the `telegram_chat` card.
    key: "telegram_channel", name: "Telegram channel", category: "planned", auth: "planned", Icon: Megaphone, logo: "telegram",
    description: "Post updates to a Telegram channel you run.",
  },
  {
    key: "slack", name: "Slack", category: "planned", auth: "planned", Icon: Hash, logo: "slack",
    description: "Post alerts and summaries where your team reads.",
  },
  {
    key: "jira", name: "Jira", category: "planned", auth: "planned", Icon: Ticket, logo: "jira",
    description: "Hear about tickets assigned to you.",
  },
  {
    key: "github", name: "GitHub", category: "planned", auth: "planned", Icon: GitPullRequest, logo: "github",
    description: "Get nudged about pull requests to review.",
  },
  {
    key: "shopify", name: "Shopify", category: "planned", auth: "planned", Icon: ShoppingBag, logo: "shopify",
    description: "Read products, stock and orders.",
  },
  {
    key: "bank", name: "Bank account", category: "planned", auth: "planned", Icon: Landmark,
    description: "Hear before an account runs low.",
  },
  {
    key: "image_generation", name: "Image generation", category: "planned", auth: "planned", Icon: ImagePlus,
    description: "Make a campaign's images, not just describe them.",
  },
  {
    key: "email_verification", name: "Email verification", category: "planned", auth: "planned", Icon: MailCheck,
    description: "Check every address before a campaign goes out.",
  },
];
