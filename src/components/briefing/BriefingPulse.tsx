import { StatGrid, type Stat } from "@/components/ui/StatGrid";
import { formatAmount } from "@/lib/format";
import type { BriefingPulse as Pulse } from "@/types/briefing";

/**
 * The counts across the top. Context, not a call to action — no change arrows,
 * because the backend sends a figure with nothing to compare it against and an
 * invented baseline would be the one number on the page we made up.
 *
 * The tiles are whatever the backend sends, in its order, so the grid is sized
 * to the count rather than StatGrid's default four — three stats in a
 * four-column grid leaves a bare cell where a fourth tile should be.
 */
const SKELETONS = 3;

const COLUMNS: Record<number, string> = {
  1: "grid-cols-1 lg:grid-cols-1",
  2: "grid-cols-2 lg:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

export function BriefingPulse({ pulse }: { pulse: Pulse[] | null }) {
  if (pulse && !pulse.length) return null;

  const stats: Stat[] | null =
    pulse?.map((item): Stat => ({ label: item.label, value: formatAmount(item.value) })) ?? null;

  return (
    <StatGrid stats={stats} skeletons={SKELETONS} className={COLUMNS[stats?.length ?? SKELETONS]} />
  );
}
