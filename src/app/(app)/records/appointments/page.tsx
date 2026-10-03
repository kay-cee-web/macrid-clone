import type { Metadata } from "next";
import { AppointmentsView } from "@/components/records/AppointmentsView";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Appointments",
  description: "Appointments on your calendar, including the ones your agents booked.",
  path: "/records/appointments",
});

export default function RecordAppointmentsPage() {
  return <AppointmentsView />;
}
