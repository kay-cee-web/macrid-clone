import { BarChart3, Briefcase, Contact, Filter, MailCheck, Send, Telescope, type LucideIcon } from "lucide-react";
import type { Idea, IdeaCategory } from "@/types/idea";

type CategoryLook = {
  Icon: LucideIcon;
  /** Gradient stops for the idea cover glow. */
  glow: string;
  /** Solid badge fill for agent icons; pair with text-surface. */
  tint: string;
};

/** The visual identity of each category, shared by idea covers and agent icons. */
export const COVERS: Record<IdeaCategory, CategoryLook> = {
  Prospecting: { Icon: Telescope, glow: "from-teal via-accent/60", tint: "bg-teal" },
  Funnels: { Icon: Filter, glow: "from-pink via-violet/60", tint: "bg-pink" },
  Outreach: { Icon: Send, glow: "from-accent via-violet/60", tint: "bg-accent" },
  CRM: { Icon: Contact, glow: "from-violet via-accent/60", tint: "bg-violet" },
  Deliverability: { Icon: MailCheck, glow: "from-good via-teal/60", tint: "bg-good" },
  Analytics: { Icon: BarChart3, glow: "from-warn via-pink/60", tint: "bg-warn" },
  Business: { Icon: Briefcase, glow: "from-accent via-teal/60", tint: "bg-muted" },
};

const LEAD_MAX = 40;

/** The cover headline: the opening clause ("Every Monday") when it's short, else the title. */
export function leadOf(idea: Idea) {
  const comma = idea.description.indexOf(", ");
  return comma > 0 && comma <= LEAD_MAX ? idea.description.slice(0, comma) : idea.title;
}
