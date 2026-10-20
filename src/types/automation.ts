/** The backend's accepted `schedule_type` values (probed 2026-10-20). */
export type ScheduleType = "daily" | "weekly" | "monthly" | "interval";

/** The accepted `deliver_to` values: where a run's result is sent. */
export type DeliverTo = "none" | "whatsapp" | "telegram";

/**
 * A scheduled task (`/agents/{id}/automations`). `schedule` is the backend's
 * own object — `{hour, minute?, day_of_week?}` seen so far, in UTC — kept
 * whole so an edit never drops a key we don't know about.
 */
export type Automation = {
  id: string;
  agentId: string;
  name: string;
  prompt: string;
  scheduleType: string;
  schedule: Record<string, unknown>;
  deliverTo: string;
  active: boolean;
  nextRunAt: string;
  lastRunAt: string;
  runCount: number;
  lastError: string;
};

/** What `PUT` takes; send only what changed. */
export type AutomationPatch = Partial<{
  name: string;
  prompt: string;
  deliver_to: DeliverTo;
  is_active: boolean;
  schedule: Record<string, unknown>;
}>;
