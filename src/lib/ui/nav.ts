/** Whether a nav entry is the current page; `matchPrefix` counts its nested routes too. */
export function isActivePath(pathname: string, href: string, matchPrefix?: boolean) {
  return matchPrefix ? pathname === href || pathname.startsWith(`${href}/`) : pathname === href;
}

/** An open agent (`/agents/12`, `/agents/12/settings`), not the hub or workbench routes beside it. */
export function isAgentWorkspace(pathname: string) {
  return /^\/agents\/(?!(?:all|workbench)(?:\/|$))[^/]+/.test(pathname);
}
