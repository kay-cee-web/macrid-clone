import { fetchAppointments } from "@/services/appointments";
import { fetchEmailCampaigns, fetchSmsCampaigns, fetchWhatsAppCampaigns } from "@/services/campaigns";
import { fetchDeals } from "@/services/deals";
import { fetchLists } from "@/services/lists";
import { fetchTasks } from "@/services/tasks";
import type { Appointment, Deal, EmailCampaign, RecordList, SmsCampaign, Task, WhatsAppCampaign } from "@/types/records";

/**
 * The Records an agent can change, read at one moment. Leads are counted per
 * list (`contacts_count`) instead of reading every lead page. A read that
 * failed is left undefined, so that resource is skipped rather than reported
 * as emptied.
 */
export type WorkspaceSnapshot = {
  takenAt: number;
  lists?: RecordList[];
  deals?: Deal[];
  tasks?: Task[];
  appointments?: Appointment[];
  emailCampaigns?: EmailCampaign[];
  smsCampaigns?: SmsCampaign[];
  whatsappCampaigns?: WhatsAppCampaign[];
};

const valueOf = <T,>(result: PromiseSettledResult<T>) => (result.status === "fulfilled" ? result.value : undefined);

export async function takeSnapshot(): Promise<WorkspaceSnapshot> {
  const [lists, deals, tasks, appointments, emailCampaigns, smsCampaigns, whatsappCampaigns] = await Promise.allSettled([
    fetchLists(),
    fetchDeals(),
    fetchTasks(),
    fetchAppointments(),
    fetchEmailCampaigns(),
    fetchSmsCampaigns(),
    fetchWhatsAppCampaigns(),
  ]);
  return {
    takenAt: Date.now(),
    lists: valueOf(lists),
    deals: valueOf(deals),
    tasks: valueOf(tasks),
    appointments: valueOf(appointments),
    emailCampaigns: valueOf(emailCampaigns),
    smsCampaigns: valueOf(smsCampaigns),
    whatsappCampaigns: valueOf(whatsappCampaigns),
  };
}
