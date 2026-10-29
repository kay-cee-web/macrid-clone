"use client";

import { useState } from "react";
import { Megaphone, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Column } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/Select";
import { SOCIAL_CONNECTORS } from "@/data/connectors/social";
import { useAsync } from "@/hooks/useAsync";
import { statusLabel } from "@/lib/records/status";
import { POST_STATUSES } from "@/lib/social/normalize";
import { fetchSocialAccounts, fetchSocialPosts, type PostFilters } from "@/services/social";
import type { SocialPost } from "@/types/social";
import { ConnectorCell, CreatedCell, StackCell, TextCell } from "./cells";
import { FailureReason } from "./FailureReason";
import { PostComposerModal } from "./PostComposerModal";
import { RecordsSection } from "./RecordsSection";
import { RecordsView } from "./RecordsView";
import { usePostActions } from "./usePostActions";

/** The backend spells the Page `facebook`; our key is `facebook_page` (see `socialKey`). */
const platformParam = (key: string) => (key === "facebook_page" ? "facebook" : key);

const columns: Column<SocialPost>[] = [
  { key: "platform", header: "Account", cell: (p) => <ConnectorCell connectorKey={p.platform} secondary={p.account} /> },
  { key: "post", header: "Post", cell: (p) => <StackCell primary={p.body || "Untitled post"} /> },
  { key: "media", header: "Media", numeric: true, wide: true, cell: (p) => <TextCell value={p.media.length || ""} muted /> },
  { key: "status", header: "Status", cell: (p) => <FailureReason status={p.status} reason={p.problem} title={p.body.slice(0, 60) || "Post"} /> },
  { key: "when", header: "When", cell: (p) => <CreatedCell value={p.publishAt || p.createdAt || null} /> },
];

const matches = (p: SocialPost, q: string) => [p.body, p.platform, p.status].some((f) => f.toLowerCase().includes(q));

const NO_FILTERS: PostFilters = { account_id: "", platform: "", status: "" };

/** `GET /social/posts`, filtered on the server by account, platform and status. */
export function SocialPosts() {
  const [filters, setFilters] = useState<PostFilters>(NO_FILTERS);
  const posts = useAsync(() => fetchSocialPosts(filters), [filters], "Could not read your posts");
  const accounts = useAsync(() => fetchSocialAccounts("social"), [], "Could not read your social accounts");
  const set = (key: keyof PostFilters) => (e: { target: { value: string } }) => setFilters((f) => ({ ...f, [key]: e.target.value }));
  const filtered = Object.values(filters).some(Boolean);
  const [composing, setComposing] = useState<SocialPost | "new" | null>(null);
  const actions = usePostActions(posts.reload, setComposing);

  return (
    <RecordsSection
      title="Post history"
      description="Everything your agents have published, scheduled or drafted."
      action={<Button icon={<Plus className="size-3.5" />} onClick={() => setComposing("new")}>New post</Button>}
    >
      <RecordsView
        noun="posts"
        rows={{ ...posts, data: posts.data?.rows ?? null }}
        columns={[...columns, actions.column]}
        rowKey={(p) => p.id}
        matches={matches}
        searchPlaceholder="Search posts"
        toolbar={
          <>
            <label htmlFor="post-account" className="sr-only">Account</label>
            <Select id="post-account" className="w-44" value={filters.account_id} onChange={set("account_id")}>
              <option value="">All accounts</option>
              {(accounts.data ?? []).filter((a) => a.kind === "social").map((a) => <option key={a.id} value={a.id}>{a.name || a.platform}</option>)}
            </Select>
            <label htmlFor="post-platform" className="sr-only">Platform</label>
            <Select id="post-platform" className="w-40" value={filters.platform} onChange={set("platform")}>
              <option value="">All platforms</option>
              {SOCIAL_CONNECTORS.map((c) => <option key={c.key} value={platformParam(c.key)}>{c.name}</option>)}
            </Select>
            <label htmlFor="post-status" className="sr-only">Status</label>
            <Select id="post-status" className="w-36" value={filters.status} onChange={set("status")}>
              <option value="">All statuses</option>
              {POST_STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
            </Select>
          </>
        }
        empty={{
          icon: <Megaphone />,
          title: filtered ? "No posts match these filters" : "No posts yet",
          description: filtered ? "Try another account, platform or status." : "Connect an account below, then ask an agent to write your first post.",
        }}
      />
      {/* The route pages at 30 and ignores per_page. */}
      {posts.data && posts.data.lastPage > 1 && (
        <p className="text-xs text-muted">Showing the latest {posts.data.rows.length} of {posts.data.total}.</p>
      )}
      {actions.dialogs}
      {composing && (
        <PostComposerModal
          post={composing === "new" ? undefined : composing}
          accounts={(accounts.data ?? []).filter((a) => a.kind === "social")}
          onClose={() => setComposing(null)}
          onSaved={() => {
            setComposing(null);
            posts.reload();
          }}
        />
      )}
    </RecordsSection>
  );
}
