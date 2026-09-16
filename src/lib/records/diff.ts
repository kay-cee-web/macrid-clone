import { formatDate, formatDateTime } from "@/lib/format";
import { WORK_AREAS, type WorkArea, type WorkChange } from "@/types/receipt";
import type { WorkspaceSnapshot } from "./snapshot";
import { statusLabel } from "./status";

type Found = WorkChange | (WorkChange | null)[] | null | undefined;
type Describe<T> = {
  created: (row: T) => Found;
  changed: (before: T, after: T) => Found;
  deleted: (row: T) => Found;
};

/** Match rows by id: new ids were created, missing ids deleted, the rest compared. */
function diffRows<T extends { id: string }>(before: T[] | undefined, after: T[] | undefined, describe: Describe<T>) {
  if (!before || !after) return [];
  const previous = new Map(before.map((row) => [row.id, row]));
  const found: Found[] = after.map((row) => {
    const old = previous.get(row.id);
    previous.delete(row.id);
    return old ? describe.changed(old, row) : describe.created(row);
  });
  previous.forEach((row) => found.push(describe.deleted(row)));
  return found.flat().filter((change): change is WorkChange => Boolean(change));
}

const change = (area: WorkArea, text: string, href: string, count = 1): WorkChange => ({ area, text, href, count });
const quoted = (name: string) => `"${name || "Untitled"}"`;
const leads = (n: number) => `${n} lead${n === 1 ? "" : "s"}`;
const status = (value: string) => statusLabel(value).toLowerCase();

const EMAIL = "/records/campaigns?channel=email";
const SMS = "/records/campaigns?channel=sms";
const WHATSAPP = "/records/campaigns?channel=whatsapp";
const funnelHref = (f: { slug: string; id: string }) => `/records/funnels/${encodeURIComponent(f.slug || f.id)}`;

/** What changed between two snapshots, in the order the areas are shown. */
export function diffSnapshots(before: WorkspaceSnapshot, after: WorkspaceSnapshot): WorkChange[] {
  const changes = [
    ...diffRows(before.lists, after.lists, {
      created: (l) => [
        change("Lists", `Created list ${quoted(l.name)}`, `/records/lists/${l.id}`),
        l.contactsCount > 0 ? change("Leads", `Added ${leads(l.contactsCount)} to ${quoted(l.name)}`, `/records/lists/${l.id}`, l.contactsCount) : null,
      ],
      changed: (a, b) => {
        const href = `/records/lists/${b.id}`;
        const delta = b.contactsCount - a.contactsCount;
        return [
          a.name !== b.name ? change("Lists", `Renamed ${quoted(a.name)} to ${quoted(b.name)}`, href) : null,
          delta > 0 ? change("Leads", `Added ${leads(delta)} to ${quoted(b.name)}`, href, delta) : null,
          delta < 0 ? change("Leads", `Removed ${leads(-delta)} from ${quoted(b.name)}`, href, -delta) : null,
        ];
      },
      deleted: (l) => change("Lists", `Deleted list ${quoted(l.name)}`, "/records/lists"),
    }),
    ...diffRows(before.deals, after.deals, {
      created: (d) => change("Deals", `Created deal ${quoted(d.name)}${d.stage ? ` in ${d.stage}` : ""}`, "/records/deals"),
      changed: (a, b) =>
        a.stage !== b.stage
          ? change("Deals", `Moved ${quoted(b.name)} from ${a.stage || "no stage"} to ${b.stage || "no stage"}`, "/records/deals")
          : a.amount !== b.amount || a.closeDate !== b.closeDate
            ? change("Deals", `Updated ${quoted(b.name)}`, "/records/deals")
            : null,
      deleted: (d) => change("Deals", `Deleted deal ${quoted(d.name)}`, "/records/deals"),
    }),
    ...diffRows(before.tasks, after.tasks, {
      created: (t) => change("Tasks", `Created task ${quoted(t.name)}${t.endDate ? `, due ${formatDate(t.endDate)}` : ""}`, "/records/tasks"),
      changed: (a, b) =>
        status(a.status) !== status(b.status) ? change("Tasks", `Marked ${quoted(b.name)} ${status(b.status)}`, "/records/tasks") : null,
      deleted: (t) => change("Tasks", `Deleted task ${quoted(t.name)}`, "/records/tasks"),
    }),
    ...diffRows(before.appointments, after.appointments, {
      created: (m) => change("Meetings", `Booked ${quoted(m.title)}${m.startAt ? ` for ${formatDateTime(m.startAt)}` : ""}`, "/records/appointments"),
      changed: (a, b) =>
        a.startAt !== b.startAt
          ? change("Meetings", `Moved ${quoted(b.title)} to ${formatDateTime(b.startAt) || "no time"}`, "/records/appointments")
          : status(a.status) !== status(b.status)
            ? change("Meetings", `Marked ${quoted(b.title)} ${status(b.status)}`, "/records/appointments")
            : null,
      deleted: (m) => change("Meetings", `Removed ${quoted(m.title)}`, "/records/appointments"),
    }),
    ...diffRows(before.emailCampaigns, after.emailCampaigns, {
      created: (c) => change("Campaigns", `Email ${quoted(c.subject)} created, ${status(c.status) || "no status"}`, EMAIL),
      changed: (a, b) =>
        status(a.status) !== status(b.status) ? change("Campaigns", `Email ${quoted(b.subject)} is now ${status(b.status)}`, EMAIL) : null,
      deleted: (c) => change("Campaigns", `Email ${quoted(c.subject)} deleted`, EMAIL),
    }),
    ...diffRows(before.smsCampaigns, after.smsCampaigns, {
      created: (c) => change("Campaigns", `SMS ${quoted(c.name || c.message.slice(0, 40))} created, ${status(c.status) || "no status"}`, SMS),
      changed: (a, b) =>
        status(a.status) !== status(b.status) ? change("Campaigns", `SMS ${quoted(b.name || b.message.slice(0, 40))} is now ${status(b.status)}`, SMS) : null,
      deleted: (c) => change("Campaigns", `SMS ${quoted(c.name || c.message.slice(0, 40))} deleted`, SMS),
    }),
    ...diffRows(before.whatsappCampaigns, after.whatsappCampaigns, {
      created: (c) => change("Campaigns", `WhatsApp ${quoted(c.name)} created, ${status(c.status) || "no status"}`, WHATSAPP),
      changed: (a, b) =>
        status(a.status) !== status(b.status) ? change("Campaigns", `WhatsApp ${quoted(b.name)} is now ${status(b.status)}`, WHATSAPP) : null,
      deleted: (c) => change("Campaigns", `WhatsApp ${quoted(c.name)} deleted`, WHATSAPP),
    }),
    ...diffRows(before.funnels, after.funnels, {
      created: (f) => change("Funnels", `Built funnel ${quoted(f.name)}`, funnelHref(f)),
      changed: (a, b) =>
        a.published !== b.published
          ? change("Funnels", `${b.published ? "Published" : "Unpublished"} ${quoted(b.name)}`, funnelHref(b))
          : a.name !== b.name
            ? change("Funnels", `Renamed funnel ${quoted(a.name)} to ${quoted(b.name)}`, funnelHref(b))
            : null,
      deleted: (f) => change("Funnels", `Deleted funnel ${quoted(f.name)}`, "/records/funnels"),
    }),
  ];
  return changes.sort((a, b) => WORK_AREAS.indexOf(a.area) - WORK_AREAS.indexOf(b.area));
}

/** One stat per area that changed, e.g. Leads 12 · Deals 1. */
export function statsOf(changes: WorkChange[]): { label: WorkArea; value: number }[] {
  return WORK_AREAS.map((area) => ({
    label: area,
    value: changes.filter((c) => c.area === area).reduce((sum, c) => sum + c.count, 0),
  })).filter((stat) => stat.value > 0);
}
