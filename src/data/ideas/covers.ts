import {
  BarChart3,
  BellRing,
  Building2,
  Contact,
  Filter,
  GraduationCap,
  ListChecks,
  MailCheck,
  Microscope,
  Palette,
  Send,
  Telescope,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { Idea, IdeaCategory } from "@/types/idea";

type CategoryLook = {
  Icon: LucideIcon;
  /** Gradient stops for the workflow cover glow. */
  glow: string;
  /** Solid badge fill; pair with text-surface. */
  tint: string;
};

/** The visual identity of each category, shared by agent icons, idea cards, covers and skill rows. */
export const COVERS: Record<IdeaCategory, CategoryLook> = {
  "Lead sourcing": { Icon: Telescope, glow: "from-teal via-accent/60", tint: "bg-teal" },
  "Page building": { Icon: Filter, glow: "from-pink via-violet/60", tint: "bg-pink" },
  "Message sending": { Icon: Send, glow: "from-accent via-violet/60", tint: "bg-accent" },
  "Pipeline handling": { Icon: Contact, glow: "from-violet via-accent/60", tint: "bg-violet" },
  Deliverability: { Icon: MailCheck, glow: "from-good via-teal/60", tint: "bg-good" },
  Analytics: { Icon: BarChart3, glow: "from-warn via-pink/60", tint: "bg-warn" },
  Creative: { Icon: Palette, glow: "from-pink via-accent/60", tint: "bg-pink" },
  Research: { Icon: Microscope, glow: "from-violet via-teal/60", tint: "bg-violet" },
  "Work productivity": { Icon: ListChecks, glow: "from-sky via-accent/60", tint: "bg-sky" },
  "Business growth": { Icon: TrendingUp, glow: "from-teal via-good/60", tint: "bg-teal" },
  "Money handling": { Icon: Wallet, glow: "from-good via-warn/60", tint: "bg-good" },
  Corporate: { Icon: Building2, glow: "from-accent via-teal/60", tint: "bg-muted" },
  Education: { Icon: GraduationCap, glow: "from-sky via-violet/60", tint: "bg-sky" },
  Reminders: { Icon: BellRing, glow: "from-sky via-teal/60", tint: "bg-sky" },
};

/**
 * The look for a category, and a neutral one for a category that no longer
 * exists. Renaming a category is a type error everywhere it is written down,
 * but a half-applied rename shouldn't take a whole page down with it.
 */
export const coverOf = (category: IdeaCategory): CategoryLook =>
  COVERS[category] ?? { Icon: ListChecks, glow: "from-muted via-line", tint: "bg-muted" };

const LEAD_MAX = 40;

/** The cover headline: the opening clause ("Every Monday") when it's short, else the title. */
export function leadOf(idea: Idea) {
  const comma = idea.description.indexOf(", ");
  return comma > 0 && comma <= LEAD_MAX ? idea.description.slice(0, comma) : idea.title;
}
