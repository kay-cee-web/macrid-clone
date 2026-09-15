/** Providers with connect/status/disconnect routes on the backend. */
export type ChannelProvider = "whatsapp" | "telegram" | "extension";

/** A pairing code from POST /agents/{id}/{provider}/connect. */
export type Pairing = {
  code: string;
  /** What the user sends, e.g. "LINK 2CPQDL". */
  message: string;
  /** WhatsApp number to message, when the provider has one. */
  number: string;
  /** Telegram bot username, when the provider has one. */
  bot: string;
  /** One-tap link with the code prefilled (Telegram deep link, or a wa.me link). */
  shortcutUrl: string;
  /** The backend's own wording of what to do. */
  instructions: string;
  expiresIn: number;
  /** Local timestamp when the code dies. */
  expiresAt: number;
};

/** One row from GET /agents/{id}/{provider}/status. */
export type ChannelLink = {
  id: string;
  status: string;
  /** Masked number or handle, a label only (e.g. "••••2736"). */
  label: string;
  lastMessageAt: string | null;
};

export type ChannelStatus = {
  connected: boolean;
  /** Live links only; pending/expired rows are excluded. */
  links: ChannelLink[];
};
