import {
  AtSign, Boxes, Calendar, Contact, FileText, Flame, HardDrive, Inbox, Layers, Mail, MapPin, MessageCircle, MessageSquare,
  Rocket, Send, Sheet, Store, Users, Waves,
} from "lucide-react";
import type { Connector, ConnectorCategory } from "@/types/connector";
import { FORM_ID, GROUP_ID, LIST_ID, PLACES_KEY, SMTP_FIELDS, TWILIO_FIELDS, apiKeyFields } from "./fields";
import { PLANNED_CONNECTORS } from "./planned";

/** Workspace connectors (same catalogue and routes as Macrid's lib/connectors.js). */
export const CONNECTOR_CATEGORIES: { key: ConnectorCategory; label: string; blurb: string }[] = [
  { key: "channel", label: "Outreach channels", blurb: "Where your agents and campaigns send from." },
  { key: "workspace", label: "Inbox, calendar and files", blurb: "What your agents read and keep: mail, meetings, documents and contacts." },
  { key: "prospect", label: "Prospect sources", blurb: "Where Dexisphere looks for businesses worth contacting." },
  { key: "email_platform", label: "Email platforms", blurb: "Keep a list you already own in step with your pipeline." },
  { key: "planned", label: "Coming soon", blurb: "Workflows already ask for these, but nothing connects them yet." },
];

/** One consent screen per Google service, asking only for that service's scopes. */
const google = (service: string) => ({ connect: `/connectors/google/redirect?service=${service}`, googleService: service });

export const CONNECTORS: Connector[] = [
  {
    key: "smtp", name: "Email (SMTP)", category: "channel", auth: "api_key", Icon: Mail, store: "mail_accounts",
    manageHref: "/multi-channel-outreach/email", fields: SMTP_FIELDS,
    description: "Send campaigns and sequences from your own mailbox.",
  },
  {
    key: "twilio", name: "SMS (Twilio)", category: "channel", auth: "api_key", Icon: MessageSquare, logo: "twilio",
    store: "sms_senders", manageHref: "/multi-channel-outreach/sms", fields: TWILIO_FIELDS, optional: true,
    description: "Text from your own number. Optional: without it, SMS goes out on Dexisphere's shared sender.",
  },
  {
    key: "whatsapp_business", name: "WhatsApp Business", category: "channel", auth: "external", Icon: MessageCircle,
    logo: "whatsapp_business", manageHref: "/settings/whatsapp-settings",
    description: "Send WhatsApp broadcasts from your business number. Connected through Meta inside Dexisphere.",
  },
  {
    key: "gmail", name: "Gmail", category: "channel", auth: "oauth", Icon: Send, logo: "gmail", ...google("gmail"),
    description: "Send from your own Google address. Sending only: to read your mail, add a mailbox.",
  },
  {
    key: "outlook_mail", name: "Outlook", category: "channel", auth: "oauth", Icon: Mail, logo: "outlook_mail",
    connect: "/connectors/outlook/redirect", description: "Mail and calendar for Microsoft accounts, in one grant.",
  },
  {
    key: "mailbox", name: "Mailbox (IMAP)", category: "workspace", auth: "api_key", Icon: Inbox, store: "mailboxes",
    description: "Let agents read your mail. Gmail, Outlook, Yahoo, Zoho or any IMAP server, with an app password.",
  },
  {
    key: "calendar", name: "Google Calendar", category: "workspace", auth: "oauth", Icon: Calendar, logo: "calendar",
    ...google("calendar"), description: "Book and move appointments, and check a slot is free before offering it.",
  },
  {
    key: "drive", name: "Google Drive", category: "workspace", auth: "oauth", Icon: HardDrive, logo: "drive",
    ...google("drive"), description: "Save what agents make, and open files you pick. It sees only those, not your whole Drive.",
  },
  {
    key: "sheets", name: "Google Sheets", category: "workspace", auth: "oauth", Icon: Sheet, logo: "sheets",
    ...google("sheets"), description: "Export lead lists and pipeline reports to a spreadsheet.",
  },
  {
    key: "docs", name: "Google Docs", category: "workspace", auth: "oauth", Icon: FileText, logo: "docs",
    ...google("docs"), description: "Write proposals, briefs and reports straight into a document.",
  },
  {
    key: "contacts", name: "Google Contacts", category: "workspace", auth: "oauth", Icon: Contact, logo: "contacts",
    ...google("contacts"), description: "Look people up and save new contacts to your Google account.",
  },
  {
    key: "google_places", name: "Google Places", category: "prospect", auth: "api_key", Icon: MapPin, logo: "google_places",
    store: "platform_apis", optional: true, fields: [PLACES_KEY],
    description: "Find local businesses by niche, city and radius. Optional: Dexisphere's shared key has a daily limit.",
  },
  {
    key: "gbp", name: "Google Business Profile", category: "prospect", auth: "oauth", Icon: Store, logo: "gbp",
    ...google("gbp"), description: "Read your own listings, hours, reviews and posts.",
  },
  {
    key: "facebook", name: "Facebook", category: "prospect", auth: "external", Icon: Users, logo: "facebook",
    manageHref: "/settings/fb-settings", description: "Pull pages and the businesses engaging with your niche.",
  },
  {
    key: "mailchimp", name: "Mailchimp", category: "email_platform", auth: "api_key", Icon: AtSign, logo: "mailchimp",
    fields: apiKeyFields(LIST_ID), description: "Push captured leads into a Mailchimp audience.",
  },
  {
    key: "brevo", name: "Brevo", category: "email_platform", auth: "api_key", Icon: Send, logo: "brevo",
    fields: apiKeyFields(LIST_ID), description: "Sync a list and send from Brevo.",
  },
  {
    key: "klaviyo", name: "Klaviyo", category: "email_platform", auth: "api_key", Icon: Waves,
    fields: apiKeyFields(LIST_ID), description: "Keep a Klaviyo list in step with your CRM.",
  },
  {
    key: "convertkit", name: "ConvertKit", category: "email_platform", auth: "api_key", Icon: Flame, logo: "convertkit",
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
  ...PLANNED_CONNECTORS,
];

export const CONNECTORS_BY_KEY: Record<string, Connector> = Object.fromEntries(CONNECTORS.map((c) => [c.key, c]));

/** Aliases the backend has used for a connector's key. */
export const CONNECTOR_ALIASES: Record<string, string> = {
  email: "smtp", sms: "twilio", outlook: "outlook_mail", google_maps: "google_places", google_business: "gbp",
  google_calendar: "calendar", google_drive: "drive", google_sheets: "sheets", google_docs: "docs", google_contacts: "contacts",
};
