"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { TextField } from "@/components/ui/TextField";
import { WEEKDAYS } from "@/lib/automations/schedule";
import { extractApiError } from "@/lib/api/errors";
import { updateAutomation } from "@/services/automations";
import type { Automation, DeliverTo } from "@/types/automation";

const DELIVER: { value: DeliverTo; label: string }[] = [
  { value: "none", label: "Chat only" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
];

const AREA = "w-full resize-y rounded-[10px] border border-line bg-surface px-3 py-2.5 text-base leading-relaxed text-ink outline-none transition-colors hover:border-faint sm:text-sm focus:border-accent focus:ring-3 focus:ring-accent-soft";

const pad = (n: unknown) => String(Number(n) || 0).padStart(2, "0");

type AutomationEditModalProps = {
  automation: Automation;
  onSaved: (automation: Automation) => void;
  onClose: () => void;
};

/**
 * Name, prompt, time, weekday and delivery. The kind of schedule (daily,
 * weekly…) isn't offered: monthly and interval keys are unconfirmed, so a
 * new cadence is the agent's to set up from chat. The time is UTC, as stored.
 */
export function AutomationEditModal({ automation, onSaved, onClose }: AutomationEditModalProps) {
  const { schedule } = automation;
  const weekly = automation.scheduleType === "weekly";
  const timed = schedule.hour !== undefined && schedule.hour !== null;
  const [name, setName] = useState(automation.name);
  const [prompt, setPrompt] = useState(automation.prompt);
  const [time, setTime] = useState(timed ? `${pad(schedule.hour)}:${pad(schedule.minute)}` : "");
  const [day, setDay] = useState(String(Number(schedule.day_of_week ?? 1) % 7));
  const [deliverTo, setDeliverTo] = useState(automation.deliverTo as DeliverTo);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !prompt.trim()) return setError("Give the task a name and say what it should do.");
    const [hour, minute] = time.split(":").map(Number);
    const next = { ...schedule, ...(timed && { hour, minute }), ...(weekly && { day_of_week: Number(day) }) };

    setSaving(true);
    setError("");
    try {
      const saved = await updateAutomation(automation.agentId, automation.id, {
        name: name.trim(),
        prompt: prompt.trim(),
        deliver_to: deliverTo,
        schedule: next,
      });
      toast.success("Task updated.");
      onSaved(saved);
    } catch (err) {
      const message = extractApiError(err, "Could not update that task");
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  return (
    <Modal open onClose={onClose} title="Edit scheduled task" description="Changes apply from the next run.">
      <form onSubmit={submit} className="grid gap-4" noValidate>
        {error && <Alert>{error}</Alert>}
        <TextField id="automation-name" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Field id="automation-prompt" label="What it does">
          <textarea id="automation-prompt" rows={4} value={prompt} onChange={(e) => setPrompt(e.target.value)} className={AREA} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          {timed && (
            <Field id="automation-time" label="Time" hint="In UTC, as the schedule is stored.">
              <Input id="automation-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </Field>
          )}
          {weekly && (
            <Field id="automation-day" label="Day">
              <Select id="automation-day" value={day} onChange={(e) => setDay(e.target.value)}>
                {WEEKDAYS.map((label, i) => <option key={label} value={i}>{label}</option>)}
              </Select>
            </Field>
          )}
          <Field id="automation-deliver" label="Send the result to">
            <Select id="automation-deliver" value={deliverTo} onChange={(e) => setDeliverTo(e.target.value as DeliverTo)}>
              {DELIVER.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
            </Select>
          </Field>
        </div>
        <div className="flex flex-wrap justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>Save</Button>
        </div>
      </form>
    </Modal>
  );
}
