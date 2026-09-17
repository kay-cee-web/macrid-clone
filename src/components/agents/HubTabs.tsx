import { RouteTabs } from "@/components/ui/RouteTabs";

/** Switches between the agent, skill and model catalogues. */
export function HubTabs() {
  return (
    <RouteTabs
      label="Agent hub"
      variant="segmented"
      tabs={[
        { href: "/agents/all", label: "Agents" },
        { href: "/agents/skills", label: "Skills" },
        { href: "/agents/models", label: "Models" },
      ]}
    />
  );
}
