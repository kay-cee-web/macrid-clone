"use client";

import type { DragEvent, ReactNode } from "react";
import { ArrowDown, ArrowUp, Copy, GripVertical, Plus, Trash2 } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Menu } from "@/components/ui/Menu";
import { kindOf } from "@/lib/notes/blockKinds";
import { cn } from "@/lib/cn";
import type { DropEdge } from "@/hooks/useBlockDrag";
import type { Block, BlockType } from "@/types/noteBlock";

/**
 * The handles fade in on the row, not the wrapper around them — an open menu
 * hangs off the grip, and fading its container would take the menu with it.
 */
const HANDLE = "opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100";

/**
 * How far down the handles sit, so they centre on the block's first line rather
 * than its top edge. A heading's line is taller than a paragraph's, and handles
 * pinned to the top of one read as belonging to the block above.
 */
const ALIGN: Partial<Record<BlockType, string>> = {
  h1: "top-1.5",
  h2: "top-1",
  code: "top-2.5",
};

type BlockRowProps = {
  block: Block;
  /** Which side to draw the drop line on while something is dragged over it. */
  dropEdge: DropEdge;
  dragging: boolean;
  onAdd: () => void;
  onDuplicate: () => void;
  onMove: (delta: number) => void;
  onDelete: () => void;
  onDragStart: (event: DragEvent) => void;
  onDragEnd: () => void;
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDrop: (event: DragEvent) => void;
  /** The block's content, and anything floating over it. */
  children: ReactNode;
};

/** One block: the gutter handles in the margin, and the content column. */
export function BlockRow({ block, dropEdge, dragging, children, ...on }: BlockRowProps) {
  const kind = kindOf(block.type);

  return (
    <div
      className={cn("group relative py-0.5", dragging && "opacity-40")}
      onDragOver={on.onDragOver}
      onDrop={on.onDrop}
    >
      {/* In the margin, not the text column: the blocks stay flush with the title. */}
      <div className={cn("absolute right-full mr-1 flex items-center gap-0.5", ALIGN[block.type] ?? "top-0.5")}>
        <IconButton label="Add a block below" size="sm" className={cn("size-6", HANDLE)} onClick={on.onAdd}>
          <Plus />
        </IconButton>
        <Menu
          align="start"
          items={[
            { label: "Duplicate", icon: <Copy />, onSelect: on.onDuplicate },
            { label: "Move up", icon: <ArrowUp />, onSelect: () => on.onMove(-1) },
            { label: "Move down", icon: <ArrowDown />, onSelect: () => on.onMove(1) },
            { label: "Delete", icon: <Trash2 />, tone: "danger", onSelect: on.onDelete },
          ]}
          trigger={(props) => (
            <IconButton
              label={`${kind.label}: drag to move, or open options`}
              size="sm"
              draggable
              onDragStart={on.onDragStart}
              onDragEnd={on.onDragEnd}
              className={cn("size-6 cursor-grab active:cursor-grabbing", HANDLE)}
              {...props}
            >
              <GripVertical />
            </IconButton>
          )}
        />
      </div>

      <div className="relative min-w-0">
        {dropEdge && (
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 z-10 h-0.5 rounded-full bg-accent",
              dropEdge === "top" ? "-top-1" : "-bottom-1",
            )}
          />
        )}
        {children}
      </div>
    </div>
  );
}
