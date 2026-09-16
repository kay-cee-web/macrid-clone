"use client";

import { Building2 } from "lucide-react";
import type { Column } from "@/components/ui/DataTable";
import { useAsync } from "@/hooks/useAsync";
import { fetchCompanies } from "@/services/companies";
import type { Company } from "@/types/records";
import { CreatedCell, StackCell, StatusCell, TextCell } from "./cells";
import { RecordsView } from "./RecordsView";

const columns: Column<Company>[] = [
  { key: "name", header: "Company", cell: (c) => <StackCell primary={<span className="font-medium">{c.name}</span>} secondary={c.domain} /> },
  { key: "type", header: "Type", cell: (c) => <StatusCell status={c.type} /> },
  { key: "industry", header: "Industry", wide: true, cell: (c) => <TextCell value={c.industry} muted /> },
  { key: "email", header: "Email", wide: true, cell: (c) => <TextCell value={c.email} /> },
  { key: "location", header: "Location", wide: true, cell: (c) => <TextCell value={c.location} muted /> },
  { key: "owner", header: "Owner", wide: true, cell: (c) => <TextCell value={c.owner} muted /> },
  { key: "created", header: "Added", cell: (c) => <CreatedCell value={c.createdAt} /> },
];

const matches = (c: Company, q: string) =>
  [c.name, c.domain, c.email, c.industry, c.type, c.location].some((field) => field.toLowerCase().includes(q));

/** Companies aren't linked to leads or deals by id in Macrid; this is the plain directory. */
export function CompaniesView() {
  const rows = useAsync(fetchCompanies, [], "Could not load companies");

  return (
    <RecordsView
      noun="companies"
      rows={rows}
      columns={columns}
      rowKey={(c) => c.id}
      matches={matches}
      searchPlaceholder="Search by name, domain, industry or city"
      empty={{
        icon: <Building2 />,
        title: "No companies yet",
        description: "Ask an agent to look up a business and save it as a company.",
      }}
    />
  );
}
