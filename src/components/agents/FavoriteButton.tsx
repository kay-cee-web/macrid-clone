"use client";

import { Star } from "lucide-react";
import { toast } from "sonner";
import { IconButton } from "@/components/ui/IconButton";
import { toggleFavorite } from "@/lib/agents/actions";
import { extractApiError } from "@/lib/api/errors";
import { cn } from "@/lib/cn";
import type { Agent } from "@/types/agent";

/**
 * The star beside a card's actions menu. A starred agent keeps it on show; an
 * unstarred one only offers it on hover or focus, the way the menu appears.
 * No success toast: the star itself is the answer.
 */
export function FavoriteButton({ agent, className }: { agent: Agent; className?: string }) {
  const favorited = agent.favorite;

  async function toggle() {
    try {
      await toggleFavorite(agent.id);
    } catch (err) {
      toast.error(extractApiError(err, "Could not update your favourites"));
    }
  }

  return (
    <IconButton
      label={favorited ? `Remove ${agent.name} from favourites` : `Add ${agent.name} to favourites`}
      aria-pressed={favorited}
      onClick={() => void toggle()}
      className={cn(
        "transition-opacity",
        favorited
          ? "text-warn hover:text-warn"
          : "can-hover:opacity-0 can-hover:group-hover:opacity-100 can-hover:focus-visible:opacity-100",
        className,
      )}
    >
      <Star className={cn(favorited && "fill-current")} />
    </IconButton>
  );
}
