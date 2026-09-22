import { Briefcase, GitPullRequest, Hash, ImagePlus, Landmark, MailCheck, ShoppingBag, Ticket } from "lucide-react";
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
    description: "Find the decision-makers behind a company and research competitors from their pages.",
  },
  {
    key: "slack", name: "Slack", category: "planned", auth: "planned", Icon: Hash, logo: "slack",
    description: "Post alerts and summaries to a channel your team already reads.",
  },
  {
    key: "jira", name: "Jira", category: "planned", auth: "planned", Icon: Ticket, logo: "jira",
    description: "Hear about tickets assigned to you, with the context around them.",
  },
  {
    key: "github", name: "GitHub", category: "planned", auth: "planned", Icon: GitPullRequest, logo: "github",
    description: "Get nudged about pull requests waiting on your review.",
  },
  {
    key: "shopify", name: "Shopify", category: "planned", auth: "planned", Icon: ShoppingBag, logo: "shopify",
    description: "Read products, stock and orders, and flag what's running out.",
  },
  {
    key: "bank", name: "Bank account", category: "planned", auth: "planned", Icon: Landmark,
    description: "Watch balances so an agent can warn you before an account runs low.",
  },
  {
    key: "image_generation", name: "Image generation", category: "planned", auth: "planned", Icon: ImagePlus,
    description: "Let agents make a campaign's images, not just describe them.",
  },
  {
    key: "email_verification", name: "Email verification", category: "planned", auth: "planned", Icon: MailCheck,
    description: "Check every address on a list before a campaign goes out.",
  },
];
