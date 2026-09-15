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
      { value: "tls", label: "TLS" },
      { value: "ssl", label: "SSL" },
      { value: "none", label: "None" },
    ],
  },
  { name: "senderemail", label: "From address", type: "email", required: true },
  { name: "sendername", label: "From name", type: "text", required: true },
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
