import { AtSign, Boxes, Calendar, Flame, Layers, Mail, MapPin, Rocket, Send, Sheet, Store, Users, Waves } from "lucide-react";
import type { Connector, ConnectorCategory } from "@/types/connector";
import { FORM_ID, GROUP_ID, LIST_ID, PLACES_KEY, SMTP_FIELDS, apiKeyFields } from "./fields";

/** Workspace connectors (same catalogue and routes as Macrid's lib/connectors.js). */
export const CONNECTOR_CATEGORIES: { key: ConnectorCategory; label: string; blurb: string }[] = [
  { key: "channel", label: "Outreach channels", blurb: "Where your agents and campaigns send from." },
  { key: "prospect", label: "Prospect sources", blurb: "Where Macrid looks for businesses worth contacting." },
  { key: "email_platform", label: "Email platforms", blurb: "Keep a list you already own in step with your pipeline." },
];

const google = (service: string) => `/connectors/google/redirect?service=${service}`;

export const CONNECTORS: Connector[] = [
  {
    key: "smtp", name: "Email (SMTP)", category: "channel", auth: "external", Icon: Mail,
    manageHref: "/multi-channel-outreach/email", fields: SMTP_FIELDS,
    description: "Send campaigns and sequences from your own mailbox.",
  },
  {
    key: "gmail", name: "Gmail", category: "channel", auth: "oauth", Icon: Send, connect: google("gmail"),
    description: "Read replies and send from your own Google address.",
  },
  {
    key: "outlook_mail", name: "Outlook", category: "channel", auth: "oauth", Icon: Mail, connect: "/connectors/outlook/redirect",
    description: "Mail and calendar for Microsoft accounts, in one grant.",
  },
  {
    key: "calendar", name: "Google Calendar", category: "channel", auth: "oauth", Icon: Calendar, connect: google("calendar"),
    description: "See your meetings so an agent can brief you beforehand.",
  },
  {
    key: "sheets", name: "Google Sheets", category: "channel", auth: "oauth", Icon: Sheet, connect: google("sheets"),
    description: "Export lead lists and pipeline reports to a spreadsheet.",
  },
  {
    key: "google_places", name: "Google Places", category: "prospect", auth: "api_key", Icon: MapPin,
    store: "platform_apis", optional: true, fields: [PLACES_KEY],
    description: "Find local businesses by niche, city and radius. Optional: Macrid's shared key has a daily limit.",
  },
  {
    key: "gbp", name: "Google Business Profile", category: "prospect", auth: "oauth", Icon: Store, connect: google("gbp"),
    description: "Read your own listings, hours, reviews and posts.",
  },
  {
    key: "facebook", name: "Facebook", category: "prospect", auth: "external", Icon: Users, manageHref: "/settings/fb-settings",
    description: "Pull pages and the businesses engaging with your niche.",
  },
  {
    key: "mailchimp", name: "Mailchimp", category: "email_platform", auth: "api_key", Icon: AtSign,
    fields: apiKeyFields(LIST_ID), description: "Push captured leads into a Mailchimp audience.",
  },
  {
    key: "brevo", name: "Brevo", category: "email_platform", auth: "api_key", Icon: Send,
    fields: apiKeyFields(LIST_ID), description: "Sync a list and send from Brevo.",
  },
  {
    key: "klaviyo", name: "Klaviyo", category: "email_platform", auth: "api_key", Icon: Waves,
    fields: apiKeyFields(LIST_ID), description: "Keep a Klaviyo list in step with your CRM.",
  },
  {
    key: "convertkit", name: "ConvertKit", category: "email_platform", auth: "api_key", Icon: Flame,
    fields: apiKeyFields(FORM_ID), description: "Subscribe new leads to a ConvertKit form.",
  },
  {
    key: "activecampaign", name: "ActiveCampaign", category: "email_platform", auth: "api_key", Icon: Layers,
    fields: apiKeyFields(LIST_ID), description: "Hand leads to an ActiveCampaign automation.",
  },
  {
    key: "mailerlite", name: "MailerLite", category: "email_platform", auth: "api_key", Icon: Boxes,
    fields: apiKeyFields(GROUP_ID), description: "Add leads to a MailerLite group.",
  },
  {
    key: "getresponse", name: "GetResponse", category: "email_platform", auth: "api_key", Icon: Rocket,
    fields: apiKeyFields(LIST_ID), description: "Feed a GetResponse list from your funnels.",
  },
  {
    key: "systeme", name: "Systeme.io", category: "email_platform", auth: "api_key", Icon: Boxes,
    fields: apiKeyFields(), description: "Sync contacts with a Systeme.io funnel.",
  },
];

export const CONNECTORS_BY_KEY: Record<string, Connector> = Object.fromEntries(CONNECTORS.map((c) => [c.key, c]));

/** Aliases the backend has used for a connector's key. */
export const CONNECTOR_ALIASES: Record<string, string> = {
  email: "smtp", outlook: "outlook_mail", google_maps: "google_places", google_business: "gbp",
};
