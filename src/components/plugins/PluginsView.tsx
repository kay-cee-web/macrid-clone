"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ConnectorsPanel } from "./ConnectorsPanel";
import { SkillsPanel } from "./SkillsPanel";

type PluginTab = "connectors" | "skills";

/** ?tab=connectors|skills */
export function PluginsView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const tab: PluginTab = params.get("tab") === "skills" ? "skills" : "connectors";

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 pb-16 pt-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="grid gap-1.5">
            <h2 className="text-[24px] font-semibold">Plugins</h2>
            <p className="max-w-[60ch] text-[14.5px] text-muted">The tools and skills your agents work with.</p>
          </div>
          <SegmentedControl
            label="Plugin type"
            value={tab}
            onChange={(next) => router.replace(`${pathname}?tab=${next}`, { scroll: false })}
            options={[
              { value: "connectors", label: "Connectors" },
              { value: "skills", label: "Skills" },
            ]}
          />
        </div>
        {tab === "connectors" ? <ConnectorsPanel /> : <SkillsPanel />}
      </div>
    </div>
  );
}
