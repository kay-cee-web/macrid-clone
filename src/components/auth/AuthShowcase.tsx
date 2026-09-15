import { WorkReceipt } from "@/components/agents/WorkReceipt";
import { Eyebrow } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { WorkingTrace } from "@/components/ui/WorkingTrace";

/** Illustrative receipts: what a morning of agent work looks like. */
const RECEIPTS = [
  {
    area: "Prospect Finder",
    badge: <Pill>Drafts only</Pill>,
    stats: [
      { label: "Found", value: 42 },
      { label: "With phone", value: 31 },
      { label: "Sent", value: 0 },
    ],
  },
  {
    area: "Outreach · WhatsApp",
    badge: <Pill tone="good" dot>Sending on</Pill>,
    stats: [
      { label: "Sent", value: 38 },
      { label: "Replies", value: 6 },
      { label: "Blocked", value: 2 },
    ],
  },
  {
    area: "CRM",
    stats: [
      { label: "Leads added", value: 31 },
      { label: "Deals moved", value: 4 },
    ],
  },
];

export function AuthShowcase() {
  return (
    <div className="relative hidden overflow-hidden border-l border-line bg-raised lg:flex lg:flex-col lg:justify-center">
      <div className="mx-auto grid w-full max-w-md gap-8 px-10 py-12">
        <div className="grid gap-3">
          <Eyebrow>While you were away · example</Eyebrow>
          <h2 className="text-[34px] font-semibold leading-[1.05]">
            Your agents did the clicking.
          </h2>
          <p className="max-w-[40ch] text-[15px] text-muted">
            Tell an agent what you need done in Macrid. It finds the leads, drafts the messages
            and updates your pipeline, and leaves you a receipt.
          </p>
        </div>
        <div className="grid gap-3">
          {RECEIPTS.map((receipt) => (
            <WorkReceipt key={receipt.area} {...receipt} className="shadow-float" />
          ))}
        </div>
        <WorkingTrace label="Verifying 120 emails in Deliverability" />
      </div>
    </div>
  );
}
