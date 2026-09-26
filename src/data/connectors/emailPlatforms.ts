import { AtSign, Boxes, Flame, Layers, Rocket, Send, Tags, Waves } from "lucide-react";
import type { Connector } from "@/types/connector";
import { API_SECRET, API_URL, apiKeyFields } from "./fields";

/**
 * The eight email platforms the user already pays for (backend doc 2026-09-26).
 * Contacts only, both ways: pull turns their subscribers into leads, push sends
 * leads out to their audience. Nothing here creates or sends a campaign — that
 * stays with our own campaign path — so no description may imply it does.
 *
 * They are their own group: /email-platforms owns them, and /connectors never
 * speaks for them (see `lib/connections/groups.ts`).
 */
const platform = (fields: Connector["fields"]) =>
  ({ category: "email_platform", auth: "api_key", store: "email_platforms", fields }) as const;

export const EMAIL_PLATFORM_CONNECTORS: Connector[] = [
  {
    key: "mailchimp", name: "Mailchimp", Icon: AtSign, logo: "mailchimp",
    ...platform(apiKeyFields("Account → Extras → API keys")),
    description: "Import your audience, or push new leads into it.",
  },
  {
    key: "brevo", name: "Brevo", Icon: Send, logo: "brevo",
    ...platform(apiKeyFields("SMTP & API → API keys")),
    description: "Import your Brevo list, or push new leads into it.",
  },
  {
    key: "klaviyo", name: "Klaviyo", Icon: Waves,
    ...platform([{
      name: "api_key", label: "Private API key", type: "password", required: true,
      placeholder: "pk_…", help: "Settings → API keys. Needs read and write on Profiles and Lists.",
    }]),
    description: "Import your Klaviyo list, or push leads into it.",
  },
  {
    key: "convertkit", name: "ConvertKit", Icon: Flame, logo: "convertkit",
    ...platform([{ ...API_SECRET, help: "Settings → Advanced → API. The secret, not the key." }]),
    description: "Import your subscribers, or push leads to a form.",
  },
  {
    key: "activecampaign", name: "ActiveCampaign", Icon: Layers,
    ...platform([API_URL, ...apiKeyFields("Settings → Developer")]),
    description: "Import your contacts, or push leads into a list.",
  },
  {
    key: "mailerlite", name: "MailerLite", Icon: Boxes,
    ...platform(apiKeyFields("Integrations → MailerLite API")),
    description: "Import a group, or push new leads into it.",
  },
  {
    key: "getresponse", name: "GetResponse", Icon: Rocket,
    ...platform(apiKeyFields("Integrations & API → API")),
    description: "Import a campaign's contacts, or push leads in.",
  },
  {
    key: "systeme", name: "Systeme.io", Icon: Tags,
    ...platform(apiKeyFields("Settings → Public API keys")),
    description: "Import your contacts, or push leads in as a tag.",
  },
];

/**
 * What each platform calls a list on its own screens. Stored per platform by
 * the backend and used in every message it sends back, so our copy has to match
 * it: telling a ConvertKit user to "pick a list" when their screen says forms is
 * how support tickets start. The API returns it too; this is the fallback.
 */
export const LIST_WORDS: Record<string, string> = {
  mailchimp: "audience",
  brevo: "list",
  klaviyo: "list",
  convertkit: "form",
  activecampaign: "list",
  mailerlite: "group",
  getresponse: "campaign",
  systeme: "tag",
};

export const DEFAULT_LIST_WORD = "list";

/** Systeme.io has no lists — it groups contacts by tag, so push needs no target. */
export const LISTLESS = ["systeme"];

export const listWordFor = (key: string) => LIST_WORDS[key] ?? DEFAULT_LIST_WORD;

const EMAIL_PLATFORM_KEYS = EMAIL_PLATFORM_CONNECTORS.map((c) => c.key);

/**
 * The backend's spelling of a platform, mapped to our connector key: "systeme_io",
 * "systeme.io" and "systemeio" are all `systeme`, the way `paymentKey` handles
 * "lemon_squeezy".
 */
export function platformKey(raw: string): string {
  const flat = raw.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  return EMAIL_PLATFORM_KEYS.find((key) => key.replace(/[^a-z0-9]/g, "") === flat)
    ?? EMAIL_PLATFORM_KEYS.find((key) => flat.startsWith(key))
    ?? raw.trim().toLowerCase();
}
