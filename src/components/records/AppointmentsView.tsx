"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import type { Column } from "@/components/ui/DataTable";
import { Pill } from "@/components/ui/Pill";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useAsync } from "@/hooks/useAsync";
import { formatDateTime } from "@/lib/format";
import { fetchAppointments } from "@/services/appointments";
import type { Appointment } from "@/types/records";
import { StackCell, StatusCell, TextCell } from "./cells";
import { RecordsView } from "./RecordsView";

type When = "upcoming" | "past" | "all";

const columns: Column<Appointment>[] = [
  {
    key: "title",
    header: "Appointment",
    cell: (a) => (
      <StackCell
        primary={<span className="font-medium">{a.title}</span>}
        secondary={a.fromBookingPage ? <Pill>Booking page</Pill> : a.location}
      />
    ),
  },
  { key: "when", header: "When", cell: (a) => <TextCell value={formatDateTime(a.startAt)} /> },
  { key: "duration", header: "Length", numeric: true, wide: true, cell: (a) => <TextCell value={a.durationMinutes && `${a.durationMinutes} min`} /> },
  { key: "attendee", header: "Attendee", cell: (a) => <StackCell primary={a.attendeeName || a.attendeeEmail || "—"} secondary={a.attendeeName && a.attendeeEmail} /> },
  { key: "status", header: "Status", cell: (a) => <StatusCell status={a.status} /> },
];

const matches = (a: Appointment, q: string) =>
  [a.title, a.attendeeName, a.attendeeEmail, a.location, a.status].some((field) => field.toLowerCase().includes(q));

/** Past appointments read newest first; upcoming ones soonest first. */
function inWindow(rows: Appointment[], when: When, now: number) {
  const start = (a: Appointment) => (a.startAt ? new Date(a.startAt).getTime() : 0);
  if (when === "upcoming") return rows.filter((a) => start(a) >= now);
  if (when === "past") return rows.filter((a) => start(a) < now).reverse();
  return rows;
}

export function AppointmentsView() {
  const state = useAsync(
    () => fetchAppointments().then((rows) => ({ rows, loadedAt: Date.now() })),
    [],
    "Could not load appointments",
  );
  const [when, setWhen] = useState<When>("upcoming");
  const data = state.data ? inWindow(state.data.rows, when, state.data.loadedAt) : null;

  return (
    <RecordsView
      noun="appointments"
      rows={{ ...state, data }}
      columns={columns}
      rowKey={(a) => a.id}
      matches={matches}
      searchPlaceholder="Search by title, attendee or location"
      toolbar={
        <SegmentedControl
          label="Time range"
          value={when}
          onChange={setWhen}
          options={[
            { value: "upcoming", label: "Upcoming" },
            { value: "past", label: "Past" },
            { value: "all", label: "All" },
          ]}
        />
      }
      empty={{
        icon: <CalendarDays />,
        title: when === "all" ? "No appointments yet" : `No ${when} appointments`,
        description: "Ask an agent to book a call with a lead, or share your booking page.",
      }}
    />
  );
}
