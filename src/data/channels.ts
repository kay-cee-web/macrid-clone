import { Globe, MessageCircle, Send, type LucideIcon } from "lucide-react";
import type { ChannelProvider } from "@/types/channel";

export type ChannelInfo = {
  id: ChannelProvider;
  name: string;
  Icon: LucideIcon;
  blurb: string;
  /** Label for the one-tap shortcut once a code exists. */
  shortcutLabel: string;
  /** Whether scanning a QR code on a phone makes sense for this channel. */
  qr: boolean;
  steps: { title: string; body: string }[];
};

export const CHANNEL_PRIVACY_NOTE = "We only see the messages you send your agent. You can disconnect anytime.";

const CODE_STEP = {
  title: "Get a pairing code",
  body: "A six-character code appears here. It works for 15 minutes.",
};

export const CHANNELS: ChannelInfo[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    Icon: MessageCircle,
    blurb: "Message your agent on WhatsApp and get its answers there.",
    shortcutLabel: "Open WhatsApp",
    qr: true,
    steps: [
      CODE_STEP,
      {
        title: "Send it from the phone you want linked",
        body: "Message the number shown with LINK and your code. Scan the QR code or tap the button to open WhatsApp with it already typed.",
      },
    ],
  },
  {
    id: "telegram",
    name: "Telegram",
    Icon: Send,
    blurb: "Chat with your agent through the Macrid bot in Telegram.",
    shortcutLabel: "Open Telegram",
    qr: true,
    steps: [
      CODE_STEP,
      {
        title: "Send it to the bot",
        body: "Open the Macrid bot and send LINK with your code. The button opens the bot with the code already attached.",
      },
    ],
  },
  {
    id: "extension",
    name: "Browser extension",
    Icon: Globe,
    blurb: "Keep your agent in a side panel and ask about the page you're on.",
    shortcutLabel: "",
    qr: false,
    steps: [
      { title: "Install the Macrid extension", body: "Add it to your browser, then open it from the toolbar on any page." },
      { title: "Enter your pairing code", body: "Type the code into the extension to link it to this agent." },
    ],
  },
];

export const channelById = (id: string | null | undefined) => CHANNELS.find((channel) => channel.id === id) ?? null;
