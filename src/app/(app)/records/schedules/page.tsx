import type { Metadata } from "next";
import { SchedulesView } from "@/components/records/SchedulesView";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Schedules",
  description: "Every recurring task your agents run, in one place.",
  path: "/records/schedules",
});

export default function RecordSchedulesPage() {
  return <SchedulesView />;
}
