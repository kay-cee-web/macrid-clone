import type { ConnectorField } from "@/types/connector";

export const SMTP_FIELDS: ConnectorField[] = [
  { name: "host", label: "SMTP host", type: "text", placeholder: "smtp.gmail.com", required: true },
  { name: "port", label: "Port", type: "number", placeholder: "587", required: true },
  { name: "username", label: "Username", type: "text", required: true },
  { name: "password", label: "Password", type: "password", required: true },
  {
    name: "encryption_type",
    label: "Encryption",
    type: "select",
    required: true,
    options: [
      { value: "TLS", label: "TLS" },
      { value: "SSL", label: "SSL" },
      { value: "None", label: "None" },
    ],
  },
  { name: "senderemail", label: "From address", type: "email", required: true },
  { name: "sendername", label: "From name", type: "text", required: true },
];

export const TWILIO_FIELDS: ConnectorField[] = [
  { name: "sid", label: "Account SID", type: "text", placeholder: "AC…", required: true },
  { name: "auth_token", label: "Auth token", type: "password", required: true },
  {
    name: "sender",
    label: "Sender",
    type: "text",
    placeholder: "+15551234567 or MyBrand",
    required: true,
    help: "A Twilio number in +E.164 format, or an alphanumeric sender ID (up to 11 characters).",
  },
];

/** The API key, with where to find it, then any other fields the platform wants. */
export const apiKeyFields = (help?: string, ...extra: ConnectorField[]): ConnectorField[] => [
  { name: "api_key", label: "API key", type: "password", required: true, help },
  ...extra,
];

/**
 * No list, form or group id field any more: /email-platforms returns the real
 * lists when the key is saved, so the target is picked from them instead of
 * being typed in.
 */
export const API_SECRET: ConnectorField = { name: "api_secret", label: "API secret", type: "password", required: true };
export const API_URL: ConnectorField = {
  name: "api_url", label: "API URL", type: "text", required: true,
  placeholder: "https://youraccount.api-us1.com", help: "Settings → Developer",
};

export const PLACES_KEY: ConnectorField = {
  name: "google_place_api_key",
  label: "Google Places API key",
  type: "password",
  required: true,
  help: "Google Cloud → Credentials. Needs the Places API (New) enabled.",
};
