import {
  AtSign, Briefcase, Camera, GitPullRequest, Hash, ImagePlus, Landmark, MailCheck, Megaphone, Music2, ShoppingBag, Ticket,
} from "lucide-react";
import type { Connector } from "@/types/connector";

/**
 * Connectors a workflow already needs that nothing on the backend connects yet.
 * Plugins lists them under "Coming soon" with the number of workflows waiting,
 * so the gap is visible to users and to whoever builds the routes. Building
 * one means giving it its real `category`, `auth` and routes, like the rest.
 */
export const PLANNED_CONNECTORS: Connector[] = [
  {
    key: "linkedin", name: "LinkedIn", category: "planned", auth: "planned", Icon: Briefcase, logo: "linkedin",
    description: "Publish posts, and find the people behind a company.",
  },
  {
    key: "x", name: "X", category: "planned", auth: "planned", Icon: AtSign, logo: "x",
    description: "Publish posts and threads from your account.",
  },
  {
    key: "instagram", name: "Instagram", category: "planned", auth: "planned", Icon: Camera, logo: "instagram",
    description: "Publish posts, carousels and reels.",
  },
  {
    key: "tiktok", name: "TikTok", category: "planned", auth: "planned", Icon: Music2, logo: "tiktok",
    description: "Upload short videos with their captions.",
  },
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
