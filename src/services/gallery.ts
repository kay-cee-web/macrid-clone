import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { toNumber, toText } from "@/lib/api/pick";
import type { GalleryItem, MediaType } from "@/types/gallery";

type Row = Record<string, unknown>;

/** Files per gallery page. */
export const GALLERY_PAGE_SIZE = 12;

const EXTENSIONS: [MediaType, RegExp][] = [
  ["image", /\.(png|jpe?g|gif|webp|avif|svg)$/i],
  ["video", /\.(mp4|mov|webm|m4v|avi)$/i],
  ["audio", /\.(mp3|wav|m4a|ogg|aac|flac)$/i],
];

/** The row's own `type`, else a guess from the file name; anything else is a document. */
function mediaTypeOf(type: string, name: string): MediaType {
  if (type === "image" || type === "video" || type === "audio" || type === "document") return type;
  const path = name.split("?")[0];
  return EXTENSIONS.find(([, pattern]) => pattern.test(path))?.[0] ?? "document";
}

function toItem(row: Row): GalleryItem {
  const url = toText(row.image_url ?? row.url);
  const name = toText(row.image_name ?? row.name) || url.split("/").pop() || "File";
  return { id: toText(row.id), type: mediaTypeOf(toText(row.type), name || url), url, name, createdAt: toText(row.created_at) };
}

/**
 * Rows may sit at `files.data` (a paginator), at `files` or `data` (flat), or
 * at `images`. No payload has been seen yet, so all are read.
 */
function rowsOf(data: Row): Row[] {
  const files = data.files as Row | Row[] | undefined;
  if (Array.isArray(files)) return files;
  if (files && Array.isArray(files.data)) return files.data as Row[];
  if (Array.isArray(data.images)) return data.images as Row[];
  return Array.isArray(data.data) ? (data.data as Row[]) : [];
}

export type GalleryPage = { items: GalleryItem[]; page: number; lastPage: number; total: number };

/**
 * One page of the workspace's hosted files (probed 2026-10-28): `files` is a
 * Laravel paginator, newest first, and `?type=image|video|audio|document`
 * filters on the server. Rows: `{id, type, url, name, size_mb, status, created_at}`.
 * Nothing in a row says whether an agent made it or the user uploaded it.
 */
export async function fetchGallery(type: MediaType | null, page: number): Promise<GalleryPage> {
  const params = { per_page: GALLERY_PAGE_SIZE, page, ...(type ? { type } : {}) };
  const { data } = await api.get("/gallery", { params });
  assertEnvelope(data, "Could not load your media");
  const files = (data as Row).files as Row | undefined;
  const items = rowsOf(data as Row).map(toItem).filter((item) => item.url);
  return {
    items,
    page: toNumber(files?.current_page) || page,
    lastPage: Math.max(1, toNumber(files?.last_page)),
    total: toNumber(files?.total) || items.length,
  };
}

export async function deleteGalleryItem(id: string) {
  const { data } = await api.delete(`/gallery/${id}`);
  assertEnvelope(data, "Could not delete that file");
}

/** The hosted URL out of an upload response (`image_url` today). */
function uploadedUrl(data: Record<string, unknown> | undefined): string {
  const nested = data?.data as Record<string, unknown> | undefined;
  const url = data?.image_url ?? data?.url ?? data?.image ?? nested?.image_url ?? nested?.url;
  return typeof url === "string" ? url.trim() : "";
}

/**
 * Upload one file to the gallery and return where it's hosted.
 * The multipart header is required: the client defaults to JSON, which would destroy the file.
 */
export async function uploadToGallery(file: File, onProgress?: (percent: number) => void) {
  const form = new FormData();
  form.append("file", file);

  const { data } = await api.post("/gallery", form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (onProgress && event.total) onProgress(Math.round((event.loaded / event.total) * 100));
    },
  });
  assertEnvelope(data, "Upload failed");

  const url = uploadedUrl(data);
  if (!url) throw new Error("The upload finished but no image link came back.");
  return { url, name: typeof data?.image_name === "string" ? data.image_name : file.name };
}
