import { onAuthEvent } from "@/lib/auth/events";
import type { WorkChange } from "@/types/receipt";
import { diffSnapshots } from "./diff";
import { takeSnapshot, type WorkspaceSnapshot } from "./snapshot";

/**
 * Work receipts. `/agents/{id}/actions` stays empty, so the only way to see
 * what a turn did is to read Records before and after it and compare.
 * Anything else that changed the workspace meanwhile (a teammate, another
 * agent) shows up too; the receipt says so.
 */

/** A snapshot this recent stands in for "before" the next turn, saving a round of reads. */
const REUSE_MS = 60_000;
/** Never hold a message back longer than this waiting for the "before" reads. */
const BEFORE_TIMEOUT_MS = 4_000;

let latest: WorkspaceSnapshot | null = null;
/** Bumped on logout so a late read for the previous user is thrown away. */
let generation = 0;

function remember(snapshot: WorkspaceSnapshot, from: number) {
  if (from === generation) latest = snapshot;
}

/** The workspace as it was before a turn, or null if it couldn't be read in time (no receipt then). */
export async function snapshotBeforeTurn(): Promise<WorkspaceSnapshot | null> {
  if (latest && Date.now() - latest.takenAt < REUSE_MS) return latest;
  const from = generation;
  const reading = takeSnapshot().then((snapshot) => {
    remember(snapshot, from);
    return snapshot;
  });
  const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), BEFORE_TIMEOUT_MS));
  return Promise.race([reading, timeout]);
}

/** Read Records again and list what changed since `before`. */
export async function changesSince(before: WorkspaceSnapshot): Promise<WorkChange[]> {
  const from = generation;
  const after = await takeSnapshot();
  remember(after, from);
  return from === generation ? diffSnapshots(before, after) : [];
}

onAuthEvent("logout", () => {
  generation += 1;
  latest = null;
});
