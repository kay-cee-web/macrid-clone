import type { Column } from "@/components/ui/DataTable";
import type { Lead } from "@/types/records";
import { CreatedCell, StackCell, StatusCell, TextCell } from "./cells";

/** Lead table columns, shared by one list's leads and the all-leads view. */
export const LEAD_COLUMNS: Column<Lead>[] = [
  { key: "name", header: "Lead", cell: (lead) => <StackCell primary={lead.name} secondary={lead.website} /> },
  { key: "email", header: "Email", cell: (lead) => <TextCell value={lead.email} /> },
  { key: "phone", header: "Phone", wide: true, cell: (lead) => <TextCell value={lead.phone} muted /> },
  { key: "status", header: "Status", cell: (lead) => <StatusCell status={lead.status} /> },
  { key: "score", header: "Score", numeric: true, wide: true, cell: (lead) => <TextCell value={lead.score} /> },
  { key: "location", header: "Location", wide: true, cell: (lead) => <TextCell value={lead.location} muted /> },
  { key: "created", header: "Added", cell: (lead) => <CreatedCell value={lead.createdAt} /> },
];

export const leadMatches = (lead: Lead, q: string) =>
  [lead.name, lead.email, lead.phone, lead.website, lead.location].some((field) => field.toLowerCase().includes(q));
