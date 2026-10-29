"use client";

import { CalendarDays, Megaphone, PenLine, Sparkles } from "lucide-react";
import { WorkspaceConnectorFlows } from "@/components/plugins/ConnectorFlows";
import { SOCIAL_CONNECTORS } from "@/data/connectors/social";
import { AskAgent, type AgentPrompt } from "./AskAgent";
import { ConnectorShelf } from "./ConnectorShelf";
import { RecordsSection } from "./RecordsSection";
import { SocialPosts } from "./SocialPosts";

const PROMPTS: AgentPrompt[] = [
  { label: "Write a post", hint: "Drafted for you to approve", Icon: PenLine, task: "Write a post for my connected social accounts about what my business offers. Show me the draft before you publish anything." },
  { label: "Plan a week of posts", hint: "Five posts, one a day", Icon: CalendarDays, task: "Plan a week of social posts for my connected accounts, one a day. Show me all five before scheduling any." },
  { label: "Announce something", hint: "With an image to go with it", Icon: Megaphone, task: "Help me announce news on my social accounts: ask me what it is, write the post, make an image for it and show me both first." },
  { label: "How did my posts do?", hint: "Reach and engagement", Icon: Sparkles, task: "Read back how my recent social posts did and tell me which ones worked best." },
];

/** Connected social accounts, everything posted or queued, and posting through an agent. */
export function SocialView() {
  return (
    <WorkspaceConnectorFlows>
      <div className="grid gap-10">
        <SocialPosts />

        <RecordsSection title="Post something" description="An agent writes it, makes the image and publishes once you say so.">
          <AskAgent label="Post with an agent" prompts={PROMPTS} />
        </RecordsSection>

        <RecordsSection title="Connected accounts" description="Where your agents can post.">
          <ConnectorShelf connectors={SOCIAL_CONNECTORS} />
        </RecordsSection>
      </div>
    </WorkspaceConnectorFlows>
  );
}
