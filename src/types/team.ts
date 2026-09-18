/**
 * A row from `GET /teams`. There is no role column yet: `POST /teams` accepts
 * `role` and drops it, so everyone the endpoint returns reads as a member.
 */
export type TeamMember = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  /** ISO string from `created_at`, or "" when the row has none. */
  addedAt: string;
};
