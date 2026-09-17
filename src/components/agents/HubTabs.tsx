import { RouteTabs } from "@/components/ui/RouteTabs";

/** Switches between the agent catalogue and the model catalogue. */
export function HubTabs() {
  return (
    <RouteTabs
      label="Agent hub"
      variant="segmented"
      tabs={[
        { href: "/agents/all", label: "Agents" },
        { href: "/agents/models", label: "Models" },
      ]}
    />
  );
}
