import { addReaction, REACTIONS } from "@/lib/notes/reactions";

/** The toolbar's reaction row: one line of emoji, and a press reacts to the highlighted run. */
export function ReactionPicker({ onDone }: { onDone: () => void }) {
  return (
    <div role="group" aria-label="React" className="flex items-center gap-0.5">
      {REACTIONS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          aria-label={`React with ${emoji}`}
          onClick={() => {
            addReaction(emoji);
            onDone();
          }}
          className="grid size-8 place-items-center rounded-lg text-lg transition hover:scale-110 hover:bg-raised"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
