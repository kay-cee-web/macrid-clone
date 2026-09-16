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

export const apiKeyFields = (...extra: ConnectorField[]): ConnectorField[] => [
  { name: "api_key", label: "API key", type: "password", required: true },
  ...extra,
];

export const LIST_ID: ConnectorField = { name: "list_id", label: "List ID", type: "text", required: true };
export const FORM_ID: ConnectorField = { name: "form_id", label: "Form ID", type: "text", required: true };
export const GROUP_ID: ConnectorField = { name: "group_id", label: "Group ID", type: "text", required: true };

export const PLACES_KEY: ConnectorField = {
  name: "google_place_api_key",
  label: "Google Places API key",
  type: "password",
  required: true,
  help: "Google Cloud → Credentials. Needs the Places API (New) enabled.",
};
