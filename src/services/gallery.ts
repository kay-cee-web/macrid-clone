import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";

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
