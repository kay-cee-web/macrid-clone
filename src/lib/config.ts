/** The main Dexisphere app, for settings that live there (mailboxes, Facebook pages). */
export const DEXISPHERE_APP_URL = (process.env.NEXT_PUBLIC_MACRID_APP_URL || "https://app.dexisphere.com").replace(/\/$/, "");

/** @deprecated Use dexisphereAppLink instead. */
export const MACRID_APP_URL = DEXISPHERE_APP_URL;

export const dexisphereAppLink = (path: string) => `${DEXISPHERE_APP_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** @deprecated Use dexisphereAppLink instead. */
export const macridAppLink = dexisphereAppLink;
