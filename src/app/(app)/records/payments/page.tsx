import type { Metadata } from "next";
import { PaymentsView } from "@/components/records/PaymentsView";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Payments",
  description: "Your connected payment systems, and their sales and refunds.",
  path: "/records/payments",
});

export default function RecordPaymentsPage() {
  return <PaymentsView />;
}
