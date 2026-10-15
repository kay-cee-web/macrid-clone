"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Menu } from "@/components/ui/Menu";
import { BLOCK_KINDS } from "@/lib/notes/blockKinds";
import { cn } from "@/lib/cn";
import type { BlockType } from "@/types/noteBlock";

type ToolbarKindMenuProps = {
  /** The block kinds this menu offers, in order. */
  types: BlockType[];
  current: BlockType;
  onType: (type: BlockType) => void;
  /** Spoken name of the trigger, e.g. "Text style". */
  label: string;
  /** What the trigger shows before its chevron. */
  face: ReactNode;
  /** Draw the trigger as a filled chip (the text-style menu). */
  chip?: boolean;
};

/** A dropdown in the selection toolbar that turns the block into another kind. */
export function ToolbarKindMenu({ types, current, onType, label, face, chip }: ToolbarKindMenuProps) {
  const kinds = types.map((type) => BLOCK_KINDS.find((kind) => kind.type === type)).filter((kind) => !!kind);

  return (
    <Menu
      align="start"
      items={kinds.map((kind) => ({
        label: kind.label,
        icon: <kind.Icon />,
        checked: kind.type === current,
        onSelect: () => onType(kind.type),
      }))}
      trigger={(props) => (
        <button
          type="button"
          aria-label={label}
          title={label}
          {...props}
          className={cn(
            "flex h-8 items-center gap-1 rounded-lg px-2 text-sm text-ink transition-colors hover:bg-raised [&_svg]:size-4",
            chip && "bg-raised/70",
          )}
        >
          {face}
          <ChevronDown className="size-3.5! text-muted" />
        </button>
      )}
    />
  );
}
