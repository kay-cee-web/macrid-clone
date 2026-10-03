const WIDTH = 560;
const HEIGHT = 680;

/**
 * A blank window centred on the screen, for OAuth consent. Call it inside the
 * click handler, before any await, or the popup blocker stops it; point it at
 * the provider once the link arrives. Null when the browser blocked it.
 */
export function openCenteredPopup(name: string): Window | null {
  const left = Math.max(0, (window.screen.width - WIDTH) / 2);
  const top = Math.max(0, (window.screen.height - HEIGHT) / 2);
  return window.open("", name, `width=${WIDTH},height=${HEIGHT},left=${left},top=${top}`);
}
