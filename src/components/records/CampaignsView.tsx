"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { EmailCampaignsView } from "./EmailCampaignsView";
import { SmsCampaignsView } from "./SmsCampaignsView";

type Channel = "email" | "sms";

/** ?channel=email|sms */
export function CampaignsView() {
  const router = useRouter();
  const pathname = usePathname();
  const channel: Channel = useSearchParams().get("channel") === "sms" ? "sms" : "email";

  const switcher = (
    <SegmentedControl
      label="Channel"
      value={channel}
      onChange={(next) => router.replace(`${pathname}?channel=${next}`, { scroll: false })}
      options={[
        { value: "email", label: "Email" },
        { value: "sms", label: "SMS" },
      ]}
    />
  );

  return channel === "sms" ? <SmsCampaignsView switcher={switcher} /> : <EmailCampaignsView switcher={switcher} />;
}
