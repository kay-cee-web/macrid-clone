/**
 * Services an idea or skill touches, each served by one or more workspace
 * connectors (`data/connectors`), the usual one first. Cards show the one
 * that's connected, else the first: email is Gmail until Outlook or SMTP is on.
 */
export const PLATFORMS = {
  google_maps: { name: "Google Maps", connectors: ["google_places"] },
  linkedin: { name: "LinkedIn", connectors: ["linkedin"] },
  facebook: { name: "Facebook", connectors: ["facebook"] },
  google_business: { name: "Google Business", connectors: ["gbp"] },
  email: { name: "Email", connectors: ["gmail", "outlook_mail", "smtp"] },
  /** Reading mail. Gmail's connection sends only, so it doesn't count here. */
  inbox: { name: "Inbox", connectors: ["mailbox", "outlook_mail"] },
  whatsapp: { name: "WhatsApp", connectors: ["whatsapp_business"] },
  sms: { name: "SMS", connectors: ["twilio"] },
  calendar: { name: "Calendar", connectors: ["calendar", "outlook_mail"] },
  slack: { name: "Slack", connectors: ["slack"] },
  jira: { name: "Jira", connectors: ["jira"] },
  github: { name: "GitHub", connectors: ["github"] },
  shopify: { name: "Shopify", connectors: ["shopify"] },
  bank: { name: "Bank account", connectors: ["bank"] },
  image_generation: { name: "Image generation", connectors: ["image_generation"] },
  email_verification: { name: "Email verification", connectors: ["email_verification"] },
} satisfies Record<string, { name: string; connectors: string[] }>;

export type PlatformId = keyof typeof PLATFORMS;
