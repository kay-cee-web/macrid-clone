"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { EmailCampaignsView } from "./EmailCampaignsView";
import { SmsCampaignsView } from "./SmsCampaignsView";
import { WhatsAppCampaignsView } from "./WhatsAppCampaignsView";

const CHANNELS = ["email", "sms", "whatsapp"] as const;
type Channel = (typeof CHANNELS)[number];

/** ?channel=email|sms|whatsapp */
export function CampaignsView() {
  const router = useRouter();
  const pathname = usePathname();
  const requested = useSearchParams().get("channel");
  const channel: Channel = CHANNELS.includes(requested as Channel) ? (requested as Channel) : "email";

  const switcher = (
    <SegmentedControl
      label="Channel"
      value={channel}
      onChange={(next) => router.replace(`${pathname}?channel=${next}`, { scroll: false })}
      options={[
        { value: "email", label: "Email" },
        { value: "sms", label: "SMS" },
        { value: "whatsapp", label: "WhatsApp" },
      ]}
    />
  );

  if (channel === "sms") return <SmsCampaignsView switcher={switcher} />;
  if (channel === "whatsapp") return <WhatsAppCampaignsView switcher={switcher} />;
  return <EmailCampaignsView switcher={switcher} />;
}
