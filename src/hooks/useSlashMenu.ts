"use client";

import { useState } from "react";
import { slashOptions, type SlashOption } from "@/lib/notes/blockKinds";

type MenuState = { blockId: string; query: string; active: number };

/**
 * The "/" menu's state: which block it belongs to, what has been typed into it,
 * and which row Enter would take.
 *
 * It opens on the first option that actually inserts a block, never on "Add new
 * note" — pressing "/" and Enter is a request for a block, and starting a whole
 * other note would be a surprising thing to do with that keystroke.
 */
export function useSlashMenu() {
  const [menu, setMenu] = useState<MenuState | null>(null);
  const options = menu ? slashOptions(menu.query) : [];

  const firstBlock = (list: SlashOption[]) => Math.max(0, list.findIndex((option) => option.type));

  return {
    menu,
    options,
    isOpen: (blockId: string) => menu?.blockId === blockId,
    current: () => (menu ? options[menu.active] : undefined),
    open: (blockId: string, query = "") =>
      setMenu({ blockId, query, active: firstBlock(slashOptions(query)) }),
    close: () => setMenu(null),
    step: (delta: number) =>
      setMenu((open) => (open ? { ...open, active: (open.active + delta + options.length) % options.length } : open)),
  };
}
