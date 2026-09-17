/**
 * Where the Laravel API lives, composed the way Macrid does it:
 *
 *   host              https://api.dexisphere.com
 *   API_ROOT          {host}/api                          public routes (e.g. /book/{track_code})
 *   USEREND_URL       {host}/api/dexisphere-userend       everything behind auth, plus login/register
 *
 * Set NEXT_PUBLIC_API_HOST (and NEXT_PUBLIC_API_USEREND if the group was
 * renamed). The older NEXT_PUBLIC_API_URL, a full userend URL, still works
 * when no host is set, so rolling back is a one-line .env change.
 */
const trim = (value: string | undefined) => (value ?? "").trim().replace(/\/+$/, "");

/** The route group name. Dexisphere renamed Macrid's group to "dexisphere-userend". */
export const USEREND = trim(process.env.NEXT_PUBLIC_API_USEREND).replace(/^\/+/, "") || "dexisphere-userend";

const host = trim(process.env.NEXT_PUBLIC_API_HOST);
const legacyUrl = trim(process.env.NEXT_PUBLIC_API_URL);

export const USEREND_URL = host ? `${host}/api/${USEREND}` : legacyUrl;

export const API_ROOT = host ? `${host}/api` : legacyUrl.replace(/\/(?:[^/]+-)?userend$/, "");

if (!USEREND_URL && typeof window !== "undefined") {
  console.error("API base URL is not set. Add NEXT_PUBLIC_API_HOST to .env.local.");
}
