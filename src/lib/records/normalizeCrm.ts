import { toMaybeNumber, toNumber, toText } from "@/lib/api/pick";
import type { Company, Deal, Lead, RecordList, Task } from "@/types/records";

type Row = Record<string, unknown>;

const textOrNull = (value: unknown) => toText(value) || null;

/** List descriptions are rich text in Macrid; show them as plain text. */
export const stripHtml = (value: unknown) =>
  toText(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function normalizeList(row: Row): RecordList {
  return {
    id: toText(row.id),
    name: toText(row.name) || "Untitled list",
    description: stripHtml(row.description),
    contactsCount: toNumber(row.contacts_count),
    createdAt: textOrNull(row.created_at),
  };
}

/** Name falls back like Macrid: full name, email user, website, then "Unknown". */
export function normalizeLead(row: Row): Lead {
  const email = toText(row.email);
  const website = toText(row.website);
  const fullName = `${toText(row.first_name)} ${toText(row.last_name)}`.trim();
  return {
    id: toText(row.id),
    name: fullName || email.split("@")[0] || website || "Unknown",
    email,
    phone: toText(row.phone),
    website,
    location: [toText(row.city), toText(row.country)].filter(Boolean).join(", ") || toText(row.address),
    status: toText(row.lead_status) || toText(row.status),
    score: toMaybeNumber(row.score),
    listId: toText(row.list_id),
    createdAt: textOrNull(row.created_at),
  };
}

export function normalizeDeal(row: Row): Deal {
  return {
    id: toText(row.id),
    name: toText(row.name) || "Untitled deal",
    stage: toText(row.stage),
    amount: toMaybeNumber(row.amount),
    closeDate: textOrNull(row.close_date),
    owner: toText(row.owner),
    company: toText(row.company),
    priority: toText(row.priority),
    createdAt: textOrNull(row.created_at),
  };
}

export function normalizeTask(row: Row): Task {
  return {
    id: toText(row.id),
    name: toText(row.name) || "Untitled task",
    type: toText(row.type),
    priority: toText(row.priority),
    deal: toText(row.deal_name) || toText(row.deal_id),
    owner: toText(row.owner),
    startDate: textOrNull(row.start_date),
    endDate: textOrNull(row.end_date),
    status: toText(row.status),
    note: toText(row.note),
    createdAt: textOrNull(row.created_at),
  };
}

export function normalizeCompany(row: Row): Company {
  return {
    id: toText(row.id),
    name: toText(row.name) || toText(row.domain) || "Untitled company",
    domain: toText(row.domain),
    email: toText(row.email),
    industry: toText(row.industry),
    type: toText(row.type) || toText(row.status),
    location: [toText(row.city), toText(row.state)].filter(Boolean).join(", "),
    owner: toText(row.owner_name) || toText(row.owner),
    createdAt: textOrNull(row.created_at),
  };
}

/** Newest first by created_at, then by id, so what an agent just made is on top. */
export function newestFirst<T extends { id: string; createdAt: string | null }>(rows: T[]): T[] {
  const time = (row: T) => (row.createdAt ? new Date(row.createdAt).getTime() || 0 : 0);
  return [...rows].sort((a, b) => time(b) - time(a) || Number(b.id) - Number(a.id));
}
