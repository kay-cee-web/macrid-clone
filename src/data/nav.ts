import { Cpu, Database, House, LayoutGrid, NotebookPen, Settings, Sunrise, Video, type LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  Icon: LucideIcon;
  /** Also active on nested routes (/records/leads under /records). */
  matchPrefix?: boolean;
};

/** The app's sections, in sidebar order. */
export const MAIN_NAV: NavItem[] = [
  { href: "/", label: "Home", Icon: House },
  { href: "/agents/all", label: "Agent hub", Icon: LayoutGrid },
  { href: "/agents/workbench", label: "Workbench", Icon: Cpu, matchPrefix: true },
  // These three are account-level, not per-agent: they carry no agent id, and
  // what they show — the day's briefing, a call's write-up, a note — belongs to
  // the workspace rather than to whichever agent happened to be open.
  { href: "/briefing", label: "Briefing", Icon: Sunrise, matchPrefix: true },
  { href: "/meetings", label: "Meetings", Icon: Video, matchPrefix: true },
  { href: "/notes", label: "Notes", Icon: NotebookPen, matchPrefix: true },
  { href: "/records", label: "Records", Icon: Database, matchPrefix: true },
];

/** The sidebar keeps Settings in its footer; the phone tab bar gives it a tab of its own. */
export const SETTINGS_NAV: NavItem = { href: "/settings", label: "Settings", Icon: Settings, matchPrefix: true };
