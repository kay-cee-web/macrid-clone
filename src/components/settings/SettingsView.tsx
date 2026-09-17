"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Activity, Radio, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";
import { ChannelsSettings } from "./ChannelsSettings";
import { GeneralSettings } from "./GeneralSettings";
import { UsageSettings } from "./UsageSettings";

const SECTIONS = [
  { id: "general", label: "General", Icon: SlidersHorizontal },
  { id: "channels", label: "Channels", Icon: Radio },
  { id: "usage", label: "Usage", Icon: Activity },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

/** ?section=general|channels|usage and, for channels, &channel=whatsapp|telegram|extension. */
export function SettingsView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const requested = params.get("section");
  const section: SectionId = SECTIONS.some((s) => s.id === requested) ? (requested as SectionId) : "general";

  const go = (next: SectionId, channel?: string | null) => {
    const query = new URLSearchParams({ section: next });
    if (channel) query.set("channel", channel);
    router.replace(`${pathname}?${query.toString()}`, { scroll: false });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 pb-16 pt-8 sm:px-6 md:grid-cols-[180px_minmax(0,1fr)] md:gap-10">
        <nav aria-label="Settings sections" className="md:sticky md:top-8 md:self-start">
          <ul className="flex gap-1 overflow-x-auto md:grid">
            {SECTIONS.map(({ id, label, Icon }) => {
              const active = id === section;
              return (
                <li key={id}>
                  <button
                    type="button"
                    aria-current={active ? "page" : undefined}
                    onClick={() => go(id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm transition-colors",
                      active ? "bg-surface font-medium text-ink ring-1 ring-inset ring-line" : "text-muted hover:bg-raised hover:text-ink",
                    )}
                  >
                    <Icon className="size-4" />
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0">
          {section === "general" && <GeneralSettings />}
          {section === "channels" && (
            <ChannelsSettings channel={params.get("channel")} onChannel={(channel) => go("channels", channel)} />
          )}
          {section === "usage" && <UsageSettings />}
        </div>
      </div>
    </div>
  );
}
