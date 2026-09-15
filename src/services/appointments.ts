import { fetchAllPages } from "@/lib/api/paginate";
import { normalizeAppointment } from "@/lib/records/normalizeOutreach";
import type { Appointment } from "@/types/records";

/**
 * GET /appointments?when=all&per_page=100&page → paginated. Like Macrid, read
 * everything and split upcoming/past in the browser. Sorted by start time.
 */
export async function fetchAppointments(): Promise<Appointment[]> {
  const { rows } = await fetchAllPages("/appointments", {
    params: { when: "all" },
    key: "appointments",
    perPage: 100,
    maxPages: 25,
    fallback: "Could not load appointments",
  });
  const start = (a: Appointment) => (a.startAt ? new Date(a.startAt).getTime() || 0 : 0);
  return rows.map(normalizeAppointment).sort((a, b) => start(a) - start(b));
}
