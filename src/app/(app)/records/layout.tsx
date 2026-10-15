import type { Metadata } from "next";
import { RecordsHeader } from "@/components/records/RecordsHeader";
import { SITE } from "@/lib/seo/site";

/** A nested template replaces the root one, so it carries the brand itself. */
export const metadata: Metadata = { title: { template: `%s · Records · ${SITE.name}`, default: "Records" } };

export default function RecordsLayout({ children }: LayoutProps<"/records">) {
  return (
    <div className="mx-auto grid w-full max-w-400 gap-8 px-4 pb-20 pt-10 sm:px-8 xl:px-14">
      <RecordsHeader />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
