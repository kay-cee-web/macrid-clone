/** What the gallery upload accepts for chat images (mirrors Macrid's limits). */
export const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "bmp"];
export const IMAGE_ACCEPT = IMAGE_EXTENSIONS.map((ext) => `.${ext}`).join(",");
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const MAX_CHAT_IMAGES = 4;

export const extensionOf = (name: string) => name.split(".").pop()?.toLowerCase() ?? "";

export const isAllowedImage = (file: File) => IMAGE_EXTENSIONS.includes(extensionOf(file.name));

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** A readable name from a hosted URL, for images that arrive without one. */
export const nameFromUrl = (url: string) =>
  decodeURIComponent(url.split("?")[0].split("/").pop() || "image");
