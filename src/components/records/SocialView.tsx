"use client";

import { CalendarDays, Megaphone, PenLine, Sparkles } from "lucide-react";
import { WorkspaceConnectorFlows } from "@/components/plugins/ConnectorFlows";
import type { Column } from "@/components/ui/DataTable";
import { SOCIAL_CONNECTORS } from "@/data/connectors/social";
import { useAsync } from "@/hooks/useAsync";
import { fetchSocialPosts } from "@/services/social";
import type { SocialPost } from "@/types/social";
import { AskAgent, type AgentPrompt } from "./AskAgent";
import { ConnectorCell, CreatedCell, StackCell, StatusCell, TextCell } from "./cells";
import { ConnectorShelf } from "./ConnectorShelf";
import { RecordsSection } from "./RecordsSection";
import { RecordsView } from "./RecordsView";

const PROMPTS: AgentPrompt[] = [
  { label: "Write a post", hint: "Drafted for you to approve", Icon: PenLine, task: "Write a post for my connected social accounts about what my business offers. Show me the draft before you publish anything." },
  { label: "Plan a week of posts", hint: "Five posts, one a day", Icon: CalendarDays, task: "Plan a week of social posts for my connected accounts, one a day. Show me all five before scheduling any." },
  { label: "Announce something", hint: "With an image to go with it", Icon: Megaphone, task: "Help me announce news on my social accounts: ask me what it is, write the post, make an image for it and show me both first." },
  { label: "How did my posts do?", hint: "Reach and engagement", Icon: Sparkles, task: "Read back how my recent social posts did and tell me which ones worked best." },
];

const columns: Column<SocialPost>[] = [
  { key: "platform", header: "Platform", cell: (post) => <ConnectorCell connectorKey={post.platform} /> },
  {
    key: "post",
    header: "Post",
    cell: (post) => (
      <StackCell primary={post.body || "Untitled post"} secondary={post.problem && <span className="text-bad">{post.problem}</span>} />
    ),
  },
  { key: "media", header: "Media", numeric: true, wide: true, cell: (post) => <TextCell value={post.media.length || ""} muted /> },
  { key: "status", header: "Status", cell: (post) => <StatusCell status={post.status} /> },
  { key: "when", header: "When", cell: (post) => <CreatedCell value={post.publishAt || post.createdAt || null} /> },
];

const matches = (post: SocialPost, q: string) =>
  [post.body, post.platform, post.status, post.problem].some((field) => field.toLowerCase().includes(q));

/** Connected social accounts, everything posted or queued, and posting through an agent. */
export function SocialView() {
  const posts = useAsync(fetchSocialPosts, [], "Could not read your posts");

  return (
    <WorkspaceConnectorFlows>
      <div className="grid gap-10">
        <RecordsSection title="Post something" description="An agent writes it, makes the image and publishes once you say so.">
          <AskAgent label="Post with an agent" prompts={PROMPTS} />
        </RecordsSection>

        <RecordsSection title="Post history" description="Everything your agents have published, scheduled or drafted.">
          <RecordsView
            noun="posts"
            rows={posts}
            columns={columns}
            rowKey={(post) => post.id}
            matches={matches}
            searchPlaceholder="Search posts"
            empty={{
              icon: <Megaphone />,
              title: "No posts yet",
              description: "Connect an account below, then ask an agent to write your first post.",
            }}
          />
        </RecordsSection>

        <RecordsSection title="Connected accounts" description="Where your agents can post.">
          <ConnectorShelf connectors={SOCIAL_CONNECTORS} />
        </RecordsSection>
      </div>
    </WorkspaceConnectorFlows>
  );
}
