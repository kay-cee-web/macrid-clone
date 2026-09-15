import type { Metadata } from "next";
import { AppointmentsView } from "@/components/records/AppointmentsView";

export const metadata: Metadata = { title: "Appointments" };

export default function RecordAppointmentsPage() {
  return <AppointmentsView />;
}
