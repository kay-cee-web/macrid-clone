import { RouteTabs, type RouteTab } from "@/components/ui/RouteTabs";

const TABS: RouteTab[] = [
  { href: "/records/lists", label: "Lists", matchPrefix: true },
  { href: "/records/customers", label: "Customers" },
  { href: "/records/tasks", label: "Tasks" },
  { href: "/records/appointments", label: "Appointments" },
  { href: "/records/campaigns", label: "Campaigns", matchPrefix: true },
  { href: "/records/funnels", label: "Funnels", matchPrefix: true },
  { href: "/records/schedules", label: "Schedules" },
  { href: "/records/social", label: "Social media" },
  { href: "/records/ads", label: "Ads" },
  { href: "/records/payments", label: "Payments" },
  { href: "/records/media", label: "Media studio" },
];

/** The Workbench's header shape: a segmented switcher over the title, on the page itself. */
export function RecordsHeader() {
  return (
    <header className="grid gap-8">
      <RouteTabs label="Record types" variant="segmented" tabs={TABS} className="scrollbar-none max-w-full overflow-x-auto" />
      <div className="grid gap-2">
        <h1 className="font-sans text-2xl font-normal tracking-normal text-ink">Records</h1>
        <p className="max-w-[62ch] text-sm text-muted">
          What your agents have built and run: customers, campaigns, schedules, posts, ads, payments and media, alongside
          anything added in Dexisphere.
        </p>
      </div>
    </header>
  );
}
