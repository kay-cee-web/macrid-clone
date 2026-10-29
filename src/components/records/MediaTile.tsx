"use client";

import { useState } from "react";
import { ExternalLink, FileText, ImageOff, Music, Trash2 } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import type { GalleryItem } from "@/types/gallery";
import { CreatedCell } from "./cells";

const FRAME = "aspect-4/3 w-full bg-raised";

/**
 * The file itself: the picture, a playable video or clip, or a document glyph.
 * A picture whose link doesn't load (files on assets.macrid.com, seen
 * 2026-10-29) gets a plain tile rather than the browser's broken-image alt text.
 */
function Preview({ item }: { item: GalleryItem }) {
  const [broken, setBroken] = useState(false);
  if (item.type === "image" && broken) {
    return (
      <div className={`${FRAME} grid place-items-center content-center gap-2 p-4 text-center`}>
        <ImageOff className="size-7 text-faint" />
        <span className="text-xs text-muted">Preview unavailable</span>
      </div>
    );
  }
  if (item.type === "image") {
    // eslint-disable-next-line @next/next/no-img-element -- hosted files on another domain
    return <img src={item.url} alt="" loading="lazy" onError={() => setBroken(true)} className={`${FRAME} object-cover`} />;
  }
  if (item.type === "video") {
    return <video src={item.url} controls preload="metadata" className={`${FRAME} object-cover`} />;
  }
  const Icon = item.type === "audio" ? Music : FileText;
  return (
    <div className={`${FRAME} grid place-items-center gap-3 p-4`}>
      <Icon className="size-8 text-muted" />
      {item.type === "audio" && <audio src={item.url} controls preload="none" className="w-full" />}
    </div>
  );
}

/** One gallery file with its name, when it arrived, and open / delete. */
export function MediaTile({ item, onDelete }: { item: GalleryItem; onDelete: (item: GalleryItem) => void }) {
  return (
    <li className="grid overflow-hidden rounded-xl border border-line bg-surface">
      <Preview item={item} />
      <div className="flex items-center gap-2 border-t border-line p-3">
        <div className="grid min-w-0 flex-1 gap-0.5">
          <span className="truncate text-sm text-ink" title={item.name}>{item.name}</span>
          <span className="text-xs">{item.createdAt ? <CreatedCell value={item.createdAt} /> : <span className="font-mono uppercase text-faint">{item.type}</span>}</span>
        </div>
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${item.name}`}
          title="Open"
          className="grid size-8 place-items-center rounded-md text-muted transition-colors hover:bg-raised hover:text-ink"
        >
          <ExternalLink className="size-4" />
        </a>
        <IconButton size="sm" label={`Delete ${item.name}`} onClick={() => onDelete(item)} className="hover:bg-bad-soft hover:text-bad">
          <Trash2 />
        </IconButton>
      </div>
    </li>
  );
}
