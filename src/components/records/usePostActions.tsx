"use client";

import { useState } from "react";
import { ExternalLink, Pencil, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { extractApiError } from "@/lib/api/errors";
import { deleteSocialPost, publishSocialPost } from "@/services/social";
import type { SocialPost } from "@/types/social";
import { actionsColumn } from "./rowActions";

/** Not yet out, so it can still be sent now or removed (the backend's `isEditable`). */
const notLive = (post: SocialPost) => ["draft", "scheduled", "failed"].includes(post.status);

/**
 * The post table's trailing buttons: Open on platform (once live), then Edit,
 * Publish now and Delete only before it goes live — the backend refuses them after.
 * Every toast is the backend's own message.
 */
export function usePostActions(onChanged: () => void, onEdit: (post: SocialPost) => void) {
  const [deleting, setDeleting] = useState<SocialPost | null>(null);

  async function publish(post: SocialPost) {
    try {
      toast.success(await publishSocialPost(post.id));
      onChanged();
    } catch (err) {
      toast.error(extractApiError(err, "Could not publish that post"));
    }
  }

  const column = actionsColumn<SocialPost>([
    { label: "Open on platform", icon: <ExternalLink />, onSelect: (p) => window.open(p.permalink, "_blank", "noopener"), hidden: (p) => !p.permalink },
    { label: "Edit post", icon: <Pencil />, onSelect: onEdit, hidden: (p) => !["draft", "scheduled"].includes(p.status) },
    { label: "Publish now", icon: <Send />, onSelect: (p) => void publish(p), hidden: (p) => !notLive(p) },
    { label: "Delete post", icon: <Trash2 />, tone: "danger", onSelect: setDeleting, hidden: (p) => !notLive(p) },
  ]);

  const dialogs = deleting && (
    <ConfirmModal
      title="Delete this post?"
      description={deleting.status === "scheduled" ? "It won't go out, and it can't be brought back." : "It can't be brought back."}
      confirmLabel="Delete"
      onClose={() => setDeleting(null)}
      onConfirm={async () => {
        try {
          toast.success(await deleteSocialPost(deleting.id));
          onChanged();
          return true;
        } catch (err) {
          toast.error(extractApiError(err, "Could not delete that post"));
          return false;
        }
      }}
    />
  );

  return { column, dialogs };
}
