"use client";

import { ArrowLeft, Link2Off, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { CHANNEL_PRIVACY_NOTE, type ChannelInfo } from "@/data/channels";
import { useChannelConnection } from "@/hooks/useChannelConnection";
import { timeAgo } from "@/lib/format";
import { PairingCard } from "./PairingCard";
import { SettingRow, SettingsSection } from "./SettingsSection";

export function ChannelDetail({ agentId, channel, onBack }: { agentId: string; channel: ChannelInfo; onBack: () => void }) {
  const connection = useChannelConnection(agentId, channel.id, channel.name);
  const { Icon } = channel;

  return (
    <div className="grid gap-6">
      <Button variant="ghost" size="sm" icon={<ArrowLeft className="size-4" />} onClick={onBack} className="justify-self-start">
        All channels
      </Button>

      <header className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-accent-soft text-accent">
          <Icon className="size-5" />
        </span>
        <div className="grid gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[22px] font-semibold">{channel.name}</h2>
            {!connection.checking && (
              <Pill tone={connection.connected ? "good" : "neutral"} dot={connection.connected}>
                {connection.connected ? "Connected" : "Not connected"}
              </Pill>
            )}
          </div>
          <p className="text-[14px] text-muted">{channel.blurb}</p>
        </div>
      </header>

      {connection.links.length > 0 && (
        <SettingsSection title="Linked">
          {connection.links.map((link) => (
            <SettingRow
              key={link.id || link.label}
              label={link.label || `${channel.name} link`}
              description={link.lastMessageAt ? `Last message ${timeAgo(link.lastMessageAt)}` : "No messages yet"}
            >
              <Button
                variant="secondary"
                size="sm"
                icon={<Link2Off className="size-3.5" />}
                loading={connection.disconnectingId === link.id}
                onClick={() => void connection.disconnect(link)}
              >
                Disconnect
              </Button>
            </SettingRow>
          ))}
        </SettingsSection>
      )}

      <section className="grid gap-4">
        <h3 className="text-[16px] font-semibold">{connection.connected ? "Pair again" : "How to connect"}</h3>
        <ol className="grid gap-3">
          {channel.steps.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-raised font-mono text-[12px] text-muted ring-1 ring-inset ring-line">
                {index + 1}
              </span>
              <div className="grid gap-0.5">
                <span className="text-[14px] font-medium">{step.title}</span>
                <span className="text-[13.5px] text-muted">{step.body}</span>
              </div>
            </li>
          ))}
        </ol>

        {connection.pairing ? (
          <PairingCard
            key={connection.pairing.code}
            channel={channel}
            pairing={connection.pairing}
            requesting={connection.connecting}
            onNewCode={() => void connection.start()}
          />
        ) : (
          <Button
            className="justify-self-start"
            loading={connection.connecting || connection.checking}
            onClick={() => void connection.start()}
          >
            {connection.checking ? "Checking…" : connection.connected ? "Re-pair this channel" : "Get a pairing code"}
          </Button>
        )}
      </section>

      <p className="flex items-center gap-2 text-[12.5px] text-faint">
        <ShieldCheck className="size-4" />
        {CHANNEL_PRIVACY_NOTE}
      </p>
    </div>
  );
}
