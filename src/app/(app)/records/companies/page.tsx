import type { Metadata } from "next";
import { CompaniesView } from "@/components/records/CompaniesView";

export const metadata: Metadata = { title: "Companies" };

export default function RecordCompaniesPage() {
  return <CompaniesView />;
}
