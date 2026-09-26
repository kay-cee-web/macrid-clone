import type { ConnectorField } from "./connector";

/**
 * The email platforms group (backend doc 2026-09-26). Contacts only, in two
 * directions: `pull` imports their subscribers as leads, `push` sends leads out
 * to their audience. No campaign creation and no sending through them.
 */
export type EmailPlatformProvider = {
  key: string;
  name: string;
  fields: ConnectorField[];
  help: string;
  /** What this platform calls a list: audience, form, group, campaign, tag… */
  listWord: string;
  /** Contacts are grouped by tag, so push needs no target chosen (Systeme.io). */
  listless: boolean;
};

/** A list on the platform's side, as `/email-platforms/{id}/lists` reports it. */
export type RemoteList = { id: string; name: string; count: number | null };

export type EmailPlatformConnection = {
  id: string;
  /** Our connector key, so it lines up with the catalogue. */
  platform: string;
  /** The chosen list's id on their side; "" when nothing is chosen yet. */
  listId: string;
  listName: string;
  listWord: string;
  listless: boolean;
  /** Set when the saved key stopped working. */
  problem: string;
  lastSyncedAt: string;
};

export type SyncDirection = "pull" | "push";

/**
 * What a sync did. Errors come back per contact, so a batch is partly good:
 * `done` is what was written, `failed` what the platform refused.
 */
export type SyncResult = {
  done: number;
  skipped: number;
  failed: number;
  message: string;
};
