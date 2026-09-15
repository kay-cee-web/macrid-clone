import type { ChatImage } from "@/types/agent";

/**
 * POST /chat has no attachment field, so hosted image URLs are appended to the
 * message text (same wording as Macrid). History comes back with that block
 * inside the text, so it is split out again before rendering.
 */
const MARKER = "\n\nAttached images (already hosted, open these URLs to view them):\n";

export function withAttachments(message: string, images: ChatImage[] = []) {
  if (!images.length) return message;
  const lines = images.map((image) => `- ${image.name || "image"}: ${image.url}`).join("\n");
  return `${message}${MARKER}${lines}`;
}

export function splitAttachments(text: string): { text: string; images: ChatImage[] } {
  const at = text.indexOf(MARKER.trim());
  if (at === -1) return { text, images: [] };

  const images = text
    .slice(at + MARKER.trim().length)
    .split("\n")
    .map((line) => line.match(/^- (.*?): (https?:\/\/\S+)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => ({ name: match[1], url: match[2] }));

  return { text: text.slice(0, at).trim(), images };
}
