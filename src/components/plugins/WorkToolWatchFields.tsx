"use client";

import { Checkbox } from "@/components/ui/Checkbox";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { isSetUp, type Connections } from "@/types/connector";
import type { WorkToolEvent } from "@/types/workTool";

/**
 * Where a watcher's reports go: the channels already working, so a pick is
 * always one that can receive.
 *
 * **The values here are guesses.** The backend doc says a watcher with no
 * notify channel is rejected at save time, but it never names the field or what
 * it accepts; `notify_channel` and the four values below are read off its prose
 * ("says so in WhatsApp, Telegram or Slack"). `POST /work-tools` validates only
 * `provider` and `credentials` and tests the credential before anything else
 * (probed 2026-09-30), so the refusal has never been seen. Nothing here blocks
 * a save on that — the backend's own answer settles both the field name and
 * whether the rule is real.
 */
const CHANNELS = [
  { connector: "whatsapp_chat", value: "whatsapp", label: "WhatsApp" },
  { connector: "telegram_chat", value: "telegram", label: "Telegram" },
  { connector: "slack", value: "slack", label: "Slack" },
  { connector: "telegram_channel", value: "telegram_channel", label: "Telegram channel" },
];

export const notifyChannelsIn = (connections: Connections | null) =>
  CHANNELS.filter((channel) => isSetUp(connections?.state[channel.connector]));

type Props = {
  idPrefix: string;
  events: WorkToolEvent[];
  watch: string[];
  onWatch: (watch: string[]) => void;
  channels: ReturnType<typeof notifyChannelsIn>;
  notify: string;
  onNotify: (value: string) => void;
  error?: string;
};

/** What to report, and where. Watch mode only — a speak connector has neither. */
export function WorkToolWatchFields({ idPrefix, events, watch, onWatch, channels, notify, onNotify, error }: Props) {
  const toggle = (value: string) =>
    onWatch(watch.includes(value) ? watch.filter((v) => v !== value) : [...watch, value]);

  return (
    <>
      {events.length > 0 && (
        <fieldset className="grid gap-2">
          <legend className="pb-1 text-sm font-medium">Tell me about</legend>
          {events.map((event) => (
            <Checkbox
              key={event.value}
              id={`${idPrefix}-watch-${event.value}`}
              label={event.label}
              checked={watch.includes(event.value)}
              onChange={() => toggle(event.value)}
            />
          ))}
        </fieldset>
      )}

      {channels.length ? (
        <Field id={`${idPrefix}-notify`} label="Tell me in" error={error}>
          <Select id={`${idPrefix}-notify`} value={notify} onChange={(e) => onNotify(e.target.value)}>
            {channels.map((channel) => (
              <option key={channel.value} value={channel.value}>{channel.label}</option>
            ))}
          </Select>
        </Field>
      ) : (
        // Guidance, not a gate. The backend doc says it rejects a watcher with
        // nowhere to report, but `notify_channel` isn't in its validation rules
        // and the credential test runs first, so we've never seen that refusal.
        // Blocking Save on a rule we can't verify would break a flow that may
        // work; letting it through costs one clear message from the backend,
        // which is the authority on its own rule either way.
        <p className="text-xs text-muted">
          Nothing is connected to send updates to yet. Connect WhatsApp or Telegram in this agent&apos;s settings, or
          Slack above, and a watcher can report there.
        </p>
      )}
    </>
  );
}
