import { Cpu, Database, House, LayoutGrid, Settings, type LucideIcon } from "lucide-react";

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
  { href: "/records", label: "Records", Icon: Database, matchPrefix: true },
];

/** The sidebar keeps Settings in its footer; the phone tab bar gives it a tab of its own. */
export const SETTINGS_NAV: NavItem = { href: "/settings", label: "Settings", Icon: Settings, matchPrefix: true };
