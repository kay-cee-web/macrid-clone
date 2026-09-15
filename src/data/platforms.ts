import { Briefcase, Mail, MapPin, MessageCircle, MessageSquare, Store, Users, type LucideIcon } from "lucide-react";

/** Services an idea touches. Shown as neutral chips so they sit well in both themes. */
export const PLATFORMS = {
  google_maps: { name: "Google Maps", Icon: MapPin },
  linkedin: { name: "LinkedIn", Icon: Briefcase },
  facebook: { name: "Facebook", Icon: Users },
  google_business: { name: "Google Business", Icon: Store },
  email: { name: "Email", Icon: Mail },
  whatsapp: { name: "WhatsApp", Icon: MessageCircle },
  sms: { name: "SMS", Icon: MessageSquare },
} satisfies Record<string, { name: string; Icon: LucideIcon }>;

export type PlatformId = keyof typeof PLATFORMS;
