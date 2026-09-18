import { RouteTabs } from "@/components/ui/RouteTabs";

/** Switches between the workflow, skill and model catalogues. */
export function WorkbenchTabs() {
  return (
    <RouteTabs
      label="Workbench"
      variant="segmented"
      tabs={[
        { href: "/agents/workbench", label: "Workflows" },
        { href: "/agents/workbench/skills", label: "Skills" },
        { href: "/agents/workbench/models", label: "Models" },
      ]}
    />
  );
}
