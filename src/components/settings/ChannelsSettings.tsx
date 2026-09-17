"use client";

import { ChevronRight } from "lucide-react";
import { Pill } from "@/components/ui/Pill";
import { Skeleton } from "@/components/ui/Skeleton";
import { useWorkspace } from "@/components/workspace/WorkspaceContext";
import { CHANNELS, channelById, type ChannelInfo } from "@/data/channels";
import { useChannelConnection } from "@/hooks/useChannelConnection";
import { ChannelDetail } from "./ChannelDetail";
import { SettingsSection } from "./SettingsSection";

function ChannelRow({ agentId, channel, onOpen }: { agentId: string; channel: ChannelInfo; onOpen: () => void }) {
  const { checking, connected, links } = useChannelConnection(agentId, channel.id, channel.name);
  const { Icon } = channel;

  return (
    <button type="button" onClick={onOpen} className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-raised">
      <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-accent-soft text-accent">
        <Icon className="size-5" />
      </span>
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="text-sm font-medium">{channel.name}</span>
        <span className="truncate text-sm text-muted">{channel.blurb}</span>
      </span>
      {checking ? (
        <Skeleton className="h-5 w-24 rounded-full" />
      ) : connected ? (
        <Pill tone="good" dot>
          {links[0]?.label ? `Linked ${links[0].label}` : "Connected"}
        </Pill>
      ) : (
        <Pill>Not connected</Pill>
      )}
      <ChevronRight className="size-4 shrink-0 text-faint" />
    </button>
  );
}

/** Channel list, or one channel's pairing screen when `channel` is set. */
export function ChannelsSettings({ channel, onChannel }: { channel: string | null; onChannel: (id: string | null) => void }) {
  const { agent } = useWorkspace();
  const open = channelById(channel);

  if (open) return <ChannelDetail agentId={agent.id} channel={open} onBack={() => onChannel(null)} />;

  return (
    <SettingsSection
      title="Channels"
      description={`Talk to ${agent.name} outside Dexisphere. Each channel links with a short pairing code.`}
    >
      {CHANNELS.map((item) => (
        <ChannelRow key={item.id} agentId={agent.id} channel={item} onOpen={() => onChannel(item.id)} />
      ))}
    </SettingsSection>
  );
}
