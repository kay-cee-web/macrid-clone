import type { ConnectorField } from "./connector";

/**
 * The work tools group (backend doc 2026-09-30). The point is not a second place
 * to manage Jira or Shopify — it's to stop opening them to find out whether
 * anything happened. So they are read-mostly, in two modes that must never be
 * mixed: `speak` is somewhere the agent posts, `watch` is something it reads and
 * reports back from. Every entry point checks the mode first.
 */
export type WorkToolMode = "speak" | "watch";

/** One event a watcher can report: `{value: "due_soon", label: "Due soon"}`. */
export type WorkToolEvent = { value: string; label: string };

export type WorkToolProvider = {
  key: string;
  name: string;
  mode: WorkToolMode;
  fields: ConnectorField[];
  help: string;
  /** Watch only: what this one can report. Empty for a speak provider. */
  events: WorkToolEvent[];
};

export type WorkToolConnection = {
  id: string;
  /** Our connector key, so it lines up with the catalogue. */
  provider: string;
  mode: WorkToolMode;
  /** Watch only: the events it reports. The backend defaults to the first. */
  watch: string[];
  /**
   * Where a watcher's reports go. A watcher saved without one is rejected, so a
   * connection that has one is the normal case; "" means speak, or a row the
   * route didn't tell us about.
   */
  notifyChannel: string;
  /** Minutes between polls. The backend floors it at 5. */
  everyMinutes: number | null;
  /** Prose ("2 minutes ago") or a timestamp, whichever the route sends. */
  lastCheckedAt: string;
  /**
   * Polling failures are silent to the user by design and surface here instead,
   * which is what puts the card on Needs attention.
   */
  problem: string;
  /** The channel or site it's pointed at: "#general", "acme.atlassian.net". */
  account: string;
};
