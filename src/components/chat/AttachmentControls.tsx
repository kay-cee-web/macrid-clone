"use client";

import { useRef } from "react";
import { CircleAlert, ImagePlus, X } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import type { Attachment } from "@/hooks/useAttachments";
import { cn } from "@/lib/cn";
import { IMAGE_ACCEPT } from "@/lib/files";

/** "+ image" button with a hidden file input. */
export function AttachButton({ onFiles, disabled }: { onFiles: (files: File[]) => void; disabled?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        multiple
        hidden
        onChange={(event) => {
          onFiles(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />
      <IconButton bordered label="Attach images" disabled={disabled} onClick={() => inputRef.current?.click()}>
        <ImagePlus />
      </IconButton>
    </>
  );
}

/** Thumbnails above the composer, with upload progress and a remove button. */
export function AttachmentList({ items, onRemove }: { items: Attachment[]; onRemove: (id: string) => void }) {
  if (!items.length) return null;
  return (
    <ul className="flex flex-wrap gap-2 px-1" aria-label="Attached images">
      {items.map((item) => (
        <li
          key={item.id}
          className={cn(
            "relative size-16 overflow-hidden rounded-[10px] border bg-raised",
            item.status === "error" ? "border-bad" : "border-line",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- local blob/hosted previews */}
          <img src={item.preview} alt={item.name} className={cn("size-full object-cover", item.status !== "done" && "opacity-50")} />
          {item.status === "uploading" && (
            <span className="absolute inset-x-1.5 bottom-1.5 h-1 overflow-hidden rounded-full bg-surface/80">
              <span className="block h-full bg-accent transition-[width]" style={{ width: `${item.progress}%` }} />
            </span>
          )}
          {item.status === "error" && (
            <CircleAlert aria-label="Upload failed" className="absolute left-1/2 top-1/2 size-5 -translate-1/2 text-bad" />
          )}
          <button
            type="button"
            aria-label={`Remove ${item.name}`}
            onClick={() => onRemove(item.id)}
            className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-ink/80 text-ground hover:bg-ink"
          >
            <X className="size-3" />
          </button>
        </li>
      ))}
    </ul>
  );
}
