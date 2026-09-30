import { GitPullRequest, Hash, Megaphone, ShoppingBag, Ticket } from "lucide-react";
import type { Connector, ConnectorField } from "@/types/connector";
import type { WorkToolEvent, WorkToolMode } from "@/types/workTool";

/**
 * Work tools (backend doc 2026-09-30): the user already has Jira, GitHub and
 * Shopify and doesn't want a second place to manage them — they want to stop
 * opening them to find out whether anything happened. So the agent polls,
 * notices what changed and says so where they already read.
 *
 * Two modes, and mixing them produces nonsense: `speak` is a place it posts,
 * `watch` is a thing it reads. Nothing here writes to Jira, GitHub or Shopify.
 *
 * **Live since 2026-09-30.** All seven routes answered 404 the morning the doc
 * arrived and 401 the same afternoon, so they went in between the two probes.
 * A 401 proves a route is *registered*, never that it works — auth middleware
 * runs before the controller resolves — so the shapes in
 * `lib/workTools/normalize.ts` are still guesses until a real payload is seen.
 */
const mode = (fields: ConnectorField[]) =>
  ({ category: "work", auth: "api_key", store: "work_tools", fields }) as const;

/** Which mode each one is. Kept off `Connector`, which no other family needs it on. */
export const WORK_TOOL_MODES: Record<string, WorkToolMode> = {
  slack: "speak", telegram_channel: "speak", jira: "watch", github: "watch", shopify: "watch",
};

const token = (label: string, help: string): ConnectorField =>
  ({ name: "token", label, type: "password", required: true, help });

/** Set per connection in `watch`; the backend defaults to the first if unset. */
export const WATCH_EVENTS: Record<string, WorkToolEvent[]> = {
  jira: [
    { value: "assigned", label: "Assigned to me" },
    { value: "mentioned", label: "I'm mentioned" },
    { value: "status_changed", label: "Status changed" },
    { value: "due_soon", label: "Due soon" },
  ],
  github: [
    { value: "review_requested", label: "Review requested" },
    { value: "assigned", label: "Assigned to me" },
    { value: "mentioned", label: "I'm mentioned" },
    { value: "failing_checks", label: "Failing checks" },
  ],
  shopify: [
    { value: "new_order", label: "New order" },
    { value: "low_stock", label: "Low stock" },
    { value: "refund", label: "Refund" },
  ],
};

export const WORK_TOOL_CONNECTORS: Connector[] = [
  {
    key: "slack", name: "Slack", Icon: Hash, logo: "slack",
    ...mode([{
      name: "webhook_url", label: "Incoming webhook URL", type: "password", required: true,
      placeholder: "https://hooks.slack.com/services/…",
      help: "api.slack.com/apps → Incoming Webhooks → Add New Webhook. The URL is tied to the channel you pick.",
    }]),
    description: "Post alerts and summaries where your team reads.",
  },
  {
    // Posting to a channel the user runs; chatting with an agent is the `telegram_chat` card.
    key: "telegram_channel", name: "Telegram channel", Icon: Megaphone, logo: "telegram",
    ...mode([
      { name: "bot_token", label: "Bot token", type: "password", required: true, help: "BotFather → /newbot, or /token for one you have." },
      {
        name: "chat_id", label: "Channel ID", type: "text", required: true, placeholder: "-1001234567890 or @mychannel",
        help: "The bot has to be an admin of the channel with Post messages on.",
      },
    ]),
    description: "Post updates to a Telegram channel you run.",
  },
  {
    key: "jira", name: "Jira", Icon: Ticket, logo: "jira",
    ...mode([
      { name: "site", label: "Site", type: "text", required: true, placeholder: "yourteam.atlassian.net" },
      { name: "email", label: "Account email", type: "email", required: true },
      { name: "api_token", label: "API token", type: "password", required: true, help: "id.atlassian.com/manage-profile/security/api-tokens" },
    ]),
    description: "Hear about tickets assigned to you.",
  },
  {
    key: "github", name: "GitHub", Icon: GitPullRequest, logo: "github",
    ...mode([token(
      "Personal access token",
      "github.com/settings/tokens — fine-grained, with Pull requests: Read and Issues: Read.",
    )]),
    description: "Get nudged about pull requests to review.",
  },
  {
    key: "shopify", name: "Shopify", Icon: ShoppingBag, logo: "shopify",
    ...mode([
      { name: "shop", label: "Shop domain", type: "text", required: true, placeholder: "yourshop.myshopify.com" },
      token("Admin API token", "Admin → Apps → Develop apps → create one, grant read_orders and read_products, then Install."),
    ]),
    description: "Read products, stock and orders.",
  },
];

export const WORK_TOOL_KEYS = WORK_TOOL_CONNECTORS.map((c) => c.key);

/** `speak` posts, `watch` reads. An unknown key reads as `watch`, the stricter of the two. */
export const modeOf = (key: string): WorkToolMode => WORK_TOOL_MODES[key] ?? "watch";

export const eventsFor = (key: string): WorkToolEvent[] => WATCH_EVENTS[key] ?? [];

/**
 * The backend's spelling mapped to our connector key, the way `paymentKey` and
 * `platformKey` do: a work tool called "telegram" is the channel, since the
 * agent's own Telegram chat isn't one of these.
 */
export function workToolKey(raw: string): string {
  const flat = raw.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  if (flat === "telegram" || flat === "telegramchannel") return "telegram_channel";
  return WORK_TOOL_KEYS.find((key) => key.replace(/[^a-z0-9]/g, "") === flat) ?? raw.trim().toLowerCase();
}
