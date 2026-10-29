"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { countOf, formatDate } from "@/lib/format";
import { csvName, downloadCsv, toCsv, type CsvColumn } from "@/lib/records/csv";
import { statusLabel } from "@/lib/records/status";
import type { Lead } from "@/types/records";

const COLUMNS: CsvColumn<Lead>[] = [
  { header: "Name", value: (l) => l.name },
  { header: "Email", value: (l) => l.email },
  { header: "Phone", value: (l) => l.phone },
  { header: "Website", value: (l) => l.website },
  { header: "Status", value: (l) => statusLabel(l.status) },
  { header: "Score", value: (l) => l.score },
  { header: "Location", value: (l) => l.location },
  { header: "Added", value: (l) => formatDate(l.createdAt) },
];

type Props = {
  /** Every customer in the list, not just the page or search on screen. */
  customers: Lead[] | null;
  /** Names the file. */
  title: string;
};

/** Downloads a list's customers as a CSV, built in the browser from what's already loaded. */
export function ExportCustomers({ customers, title }: Props) {
  const ready = Boolean(customers?.length);

  return (
    <Button
      variant="secondary"
      disabled={!ready}
      icon={<Download className="size-3.5" />}
      onClick={() => {
        if (!customers?.length) return;
        downloadCsv(csvName(title), toCsv(customers, COLUMNS));
        toast.success(`Exported ${countOf(customers.length, "customers")}.`);
      }}
    >
      Export
    </Button>
  );
}
