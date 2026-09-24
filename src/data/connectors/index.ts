import {
  AtSign, Boxes, Calendar, Contact, FileText, Flame, HardDrive, Inbox, Layers, Mail, MapPin, MessageCircle, MessageSquare,
  Rocket, Send, Sheet, Store, Users, Waves,
} from "lucide-react";
import type { Connector, ConnectorCategory } from "@/types/connector";
import {
  API_SECRET, API_URL, FORM_ID, GROUP_ID, LIST_ID, PLACES_KEY, SMTP_FIELDS, TWILIO_FIELDS, apiKeyFields, optional,
} from "./fields";
import { MESSAGING_CONNECTORS } from "./messaging";
import { PAYMENT_CONNECTORS } from "./payments";
import { PLANNED_CONNECTORS } from "./planned";

/**
 * Workspace connectors (same catalogue and routes as Macrid's lib/connectors.js).
 * Copy rule: say what the user gets, not which scope it needs, in under about
 * 60 characters, so a card stays one or two lines at any width.
 */
export const CONNECTOR_CATEGORIES: { key: ConnectorCategory; label: string; blurb: string }[] = [
  { key: "google", label: "Google", blurb: "One sign-in per service, so you share only what you need." },
  { key: "microsoft", label: "Microsoft", blurb: "Mail and calendar for Microsoft accounts." },
  { key: "mailbox", label: "Mailbox", blurb: "The read half: replies and anything else in your inbox." },
  { key: "messaging", label: "Messaging", blurb: "Talk to this agent from your phone." },
  { key: "payments", label: "Payments", blurb: "Read-only. Agents see your sales; they can't move money." },
  { key: "sending", label: "Sending", blurb: "Your own senders for email, SMS and WhatsApp broadcasts." },
  { key: "prospect", label: "Prospect sources", blurb: "Where Dexisphere looks for businesses worth contacting." },
  { key: "email_platform", label: "Email platforms", blurb: "Keep a list you already own in step with your pipeline." },
  { key: "planned", label: "Coming soon", blurb: "Workflows already ask for these, but nothing connects them yet." },
];

/** One consent screen per Google service, asking only for that service's scopes. */
const google = (service: string) =>
  ({ category: "google", auth: "oauth", connect: `/connectors/google/redirect?service=${service}`, googleService: service }) as const;

export const CONNECTORS: Connector[] = [
  {
    key: "gmail", name: "Gmail", Icon: Send, logo: "gmail", ...google("gmail"),
    description: "Send email from your own address, so replies land in your inbox.",
  },
  {
    key: "calendar", name: "Google Calendar", Icon: Calendar, logo: "calendar", ...google("calendar"),
    description: "Book, move and cancel meetings, and check what's already taken.",
  },
  {
    key: "drive", name: "Google Drive", Icon: HardDrive, logo: "drive", ...google("drive"),
    description: "Open files you pick, and save what your agent creates.",
  },
  {
    key: "sheets", name: "Google Sheets", Icon: Sheet, logo: "sheets", ...google("sheets"),
    description: "Read and update spreadsheets you share with your agent.",
  },
  {
    key: "docs", name: "Google Docs", Icon: FileText, logo: "docs", ...google("docs"),
    description: "Draft and edit documents without leaving the chat.",
  },
  {
    key: "contacts", name: "Google Contacts", Icon: Contact, logo: "contacts", ...google("contacts"),
    description: "Pull your contacts in, and save new ones back.",
  },
  {
    key: "gbp", name: "Google Business Profile", Icon: Store, logo: "gbp", ...google("gbp"),
    description: "Read the listings you manage, with reviews and enquiries.",
  },
  {
    key: "outlook_mail", name: "Outlook", category: "microsoft", auth: "oauth", Icon: Mail, logo: "outlook_mail",
    connect: "/connectors/outlook/redirect", description: "Mail and calendar for Microsoft accounts, in one grant.",
  },
  {
    key: "mailbox", name: "Mailbox", category: "mailbox", auth: "api_key", Icon: Inbox, store: "mailboxes",
    description: "Read replies from Gmail, Outlook or any IMAP account. Needs an app password, not your normal one.",
  },
  ...MESSAGING_CONNECTORS,
  ...PAYMENT_CONNECTORS,
  {
    key: "smtp", name: "Email (SMTP)", category: "sending", auth: "api_key", Icon: Mail, store: "mail_accounts",
    manageHref: "/multi-channel-outreach/email", fields: SMTP_FIELDS,
    description: "Send campaigns from any mailbox, with its server details.",
  },
  {
    key: "twilio", name: "SMS (Twilio)", category: "sending", auth: "api_key", Icon: MessageSquare, logo: "twilio",
    store: "sms_senders", manageHref: "/multi-channel-outreach/sms", fields: TWILIO_FIELDS, optional: true,
    description: "Text from your own number instead of the shared one.",
  },
  {
    key: "whatsapp_business", name: "WhatsApp Business", category: "sending", auth: "external", Icon: MessageCircle,
    logo: "whatsapp_business", manageHref: "/settings/whatsapp-settings",
    description: "Send WhatsApp broadcasts from your business number.",
  },
  {
    key: "google_places", name: "Google Places", category: "prospect", auth: "api_key", Icon: MapPin, logo: "google_places",
    store: "platform_apis", optional: true, fields: [PLACES_KEY],
    description: "Find local businesses without the shared daily limit.",
  },
  {
    key: "facebook", name: "Facebook", category: "prospect", auth: "oauth", Icon: Users, logo: "facebook",
    connect: "/connectors/facebook/redirect", description: "Find the pages and businesses active in your niche.",
  },
  // Fields as GET /connectors lists them (2026-09-24).
  {
    key: "mailchimp", name: "Mailchimp", category: "email_platform", auth: "api_key", Icon: AtSign, logo: "mailchimp",
    fields: apiKeyFields("Account → Extras → API keys", optional(LIST_ID)),
    description: "Push captured leads into a Mailchimp audience.",
  },
  {
    key: "brevo", name: "Brevo", category: "email_platform", auth: "api_key", Icon: Send, logo: "brevo",
    fields: apiKeyFields("SMTP & API → API keys"), description: "Sync a list and send from Brevo.",
  },
  {
    key: "klaviyo", name: "Klaviyo", category: "email_platform", auth: "api_key", Icon: Waves,
    fields: [{ ...apiKeyFields("Settings → API keys. The private one, not public.")[0], label: "Private API key" }],
    description: "Keep a Klaviyo list in step with your CRM.",
  },
  {
    key: "convertkit", name: "ConvertKit", category: "email_platform", auth: "api_key", Icon: Flame, logo: "convertkit",
    fields: apiKeyFields(undefined, API_SECRET, optional(FORM_ID)), description: "Subscribe new leads to a ConvertKit form.",
  },
  {
    key: "activecampaign", name: "ActiveCampaign", category: "email_platform", auth: "api_key", Icon: Layers,
    fields: [API_URL, ...apiKeyFields()], description: "Hand leads to an ActiveCampaign automation.",
  },
  {
    key: "mailerlite", name: "MailerLite", category: "email_platform", auth: "api_key", Icon: Boxes,
    fields: apiKeyFields("Integrations → API", optional(GROUP_ID)), description: "Add leads to a MailerLite group.",
  },
  {
    key: "getresponse", name: "GetResponse", category: "email_platform", auth: "api_key", Icon: Rocket,
    fields: apiKeyFields(), description: "Feed a GetResponse list from your funnels.",
  },
  {
    key: "systeme", name: "Systeme.io", category: "email_platform", auth: "api_key", Icon: Boxes,
    fields: apiKeyFields(), description: "Sync contacts with a Systeme.io funnel.",
  },
  ...PLANNED_CONNECTORS,
];

export const CONNECTORS_BY_KEY: Record<string, Connector> = Object.fromEntries(CONNECTORS.map((c) => [c.key, c]));

/** Aliases the backend has used for a connector's key. */
export const CONNECTOR_ALIASES: Record<string, string> = {
  email: "smtp", sms: "twilio", outlook: "outlook_mail", google_maps: "google_places", google_business: "gbp",
  google_calendar: "calendar", google_drive: "drive", google_sheets: "sheets", google_docs: "docs", google_contacts: "contacts",
};
