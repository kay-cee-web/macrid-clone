import { RouteTabs, type RouteTab } from "@/components/ui/RouteTabs";

const TABS: RouteTab[] = [
  { href: "/records/lists", label: "Lists", matchPrefix: true },
  { href: "/records/leads", label: "Leads" },
  { href: "/records/companies", label: "Companies" },
  { href: "/records/deals", label: "Deals" },
  { href: "/records/tasks", label: "Tasks" },
  { href: "/records/appointments", label: "Appointments" },
  { href: "/records/campaigns", label: "Campaigns", matchPrefix: true },
  { href: "/records/funnels", label: "Funnels", matchPrefix: true },
  { href: "/records/analytics", label: "Analytics" },
];

export function RecordsHeader() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-1 px-4 pt-8 sm:px-8">
        <h1 className="text-[28px] font-semibold leading-tight">Records</h1>
        <p className="max-w-[64ch] text-[14px] text-muted">
          Your Macrid workspace data. Leads, deals, campaigns and funnels your agents create show up here, alongside
          anything added in Macrid.
        </p>
        <RouteTabs label="Record types" tabs={TABS} className="-mx-2.5 mt-3" />
      </div>
    </header>
  );
}
