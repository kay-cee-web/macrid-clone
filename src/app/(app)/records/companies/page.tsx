import type { Metadata } from "next";
import { CompaniesView } from "@/components/records/CompaniesView";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Companies",
  description: "The companies in your CRM, with industry, owner and location.",
  path: "/records/companies",
});

export default function RecordCompaniesPage() {
  return <CompaniesView />;
}
