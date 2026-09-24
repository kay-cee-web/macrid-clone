import { MessageCircle, Send } from "lucide-react";
import type { Connector } from "@/types/connector";

/**
 * Talking to an agent from a phone. These belong to one agent, not the
 * workspace: the card reads the open agent's link and pairs in its settings
 * (Settings → Channels), where the code, QR and countdown already live.
 */
export const MESSAGING_CONNECTORS: Connector[] = [
  {
    key: "whatsapp_chat", name: "WhatsApp", category: "messaging", auth: "channel", channel: "whatsapp",
    Icon: MessageCircle, logo: "whatsapp_business",
    description: "Get alerts and talk to your agent from your phone.",
  },
  {
    key: "telegram_chat", name: "Telegram", category: "messaging", auth: "channel", channel: "telegram",
    Icon: Send, logo: "telegram",
    description: "Same agent, on Telegram.",
  },
];
