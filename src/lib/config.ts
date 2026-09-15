/** The main Macrid app, for settings that live there (mailboxes, Facebook pages). */
export const MACRID_APP_URL = (process.env.NEXT_PUBLIC_MACRID_APP_URL || "https://app.macrid.com").replace(/\/$/, "");

export const macridAppLink = (path: string) => `${MACRID_APP_URL}${path.startsWith("/") ? path : `/${path}`}`;
