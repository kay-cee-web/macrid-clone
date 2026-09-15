import type { Metadata } from "next";
import { RecordsHeader } from "@/components/records/RecordsHeader";

export const metadata: Metadata = { title: { template: "%s · Records", default: "Records" } };

export default function RecordsLayout({ children }: LayoutProps<"/records">) {
  return (
    <>
      <RecordsHeader />
      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-6 sm:px-8">{children}</div>
    </>
  );
}
