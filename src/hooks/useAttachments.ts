"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { extractApiError } from "@/lib/api/errors";
import { IMAGE_MAX_BYTES, MAX_CHAT_IMAGES, formatBytes, isAllowedImage, nameFromUrl } from "@/lib/files";
import { uploadToGallery } from "@/services/gallery";
import type { ChatImage } from "@/types/agent";

export type Attachment = {
  id: string;
  name: string;
  url: string;
  /** Local object URL, shown while the upload is still running. */
  preview: string;
  status: "uploading" | "done" | "error";
  progress: number;
};

const newId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

/** Images upload the moment they're picked, so a message only ever carries hosted links. */
export function useAttachments(initialUrls: string[] = []) {
  const [items, setItems] = useState<Attachment[]>(() =>
    initialUrls.slice(0, MAX_CHAT_IMAGES).map((url) => ({
      id: newId(), name: nameFromUrl(url), url, preview: url, status: "done", progress: 100,
    })),
  );

  const patch = (id: string, change: Partial<Attachment>) =>
    setItems((list) => list.map((item) => (item.id === id ? { ...item, ...change } : item)));

  const add = useCallback(
    (files: File[]) => {
      const room = MAX_CHAT_IMAGES - items.length;
      if (room <= 0) return void toast.error(`You can attach up to ${MAX_CHAT_IMAGES} images.`);
      if (files.length > room) toast.message(`Only the first ${room} image${room === 1 ? "" : "s"} were added.`);

      for (const file of files.slice(0, room)) {
        if (!isAllowedImage(file)) {
          toast.error(`${file.name} isn't a supported image. Use JPG, PNG, WebP, GIF or BMP.`);
          continue;
        }
        if (file.size > IMAGE_MAX_BYTES) {
          toast.error(`${file.name} is ${formatBytes(file.size)}. Images must be under ${formatBytes(IMAGE_MAX_BYTES)}.`);
          continue;
        }
        const id = newId();
        const preview = URL.createObjectURL(file);
        setItems((list) => [...list, { id, name: file.name, url: "", preview, status: "uploading", progress: 0 }]);
        uploadToGallery(file, (progress) => patch(id, { progress }))
          .then(({ url, name }) => patch(id, { url, name, status: "done", progress: 100 }))
          .catch((err) => {
            patch(id, { status: "error" });
            toast.error(extractApiError(err, `Couldn't upload ${file.name}`));
          });
      }
    },
    [items.length],
  );

  const remove = useCallback((id: string) => {
    setItems((list) => {
      const item = list.find((i) => i.id === id);
      if (item?.preview.startsWith("blob:")) URL.revokeObjectURL(item.preview);
      return list.filter((i) => i.id !== id);
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const uploading = items.some((item) => item.status === "uploading");
  const images: ChatImage[] = items
    .filter((item) => item.status === "done")
    .map((item) => ({ url: item.url, name: item.name }));

  return { items, images, uploading, add, remove, clear, full: items.length >= MAX_CHAT_IMAGES };
}
