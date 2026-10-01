/**
 * The colours a note can be written in.
 *
 * Hex, not a theme token, because the colour is stored in the note itself —
 * `<span style="color:#…">` travels with the markdown to the backend and to
 * anything else that reads it, where our CSS variables mean nothing. They are
 * mid-tones on purpose, so a note written in light mode is still legible in
 * dark. This is the one place in the app that names a colour outright; nothing
 * in the interface itself uses them.
 */
export type NoteColor = { name: string; hex: string };

/** An empty hex is "Default" — no colour at all, which stores no span. */
export const NOTE_COLORS: NoteColor[] = [
  { name: "Default", hex: "" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Green", hex: "#16a34a" },
  { name: "Orange", hex: "#f97316" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Red", hex: "#ef4444" },
  { name: "Yellow", hex: "#ca8a04" },
];
