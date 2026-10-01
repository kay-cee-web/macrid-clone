"use client";

import { useBlockDoc } from "@/hooks/useBlockDoc";
import { useBlockDrag } from "@/hooks/useBlockDrag";
import { useBlockSelection } from "@/hooks/useBlockSelection";
import { useSlashMenu } from "@/hooks/useSlashMenu";
import { blockEditing } from "@/lib/notes/editing";
import type { Block, BlockType } from "@/types/noteBlock";
import { BlockBody } from "./BlockBody";
import { BlockRow } from "./BlockRow";
import { SelectionToolbar } from "./SelectionToolbar";
import { SlashMenu } from "./SlashMenu";

/** The figure each numbered item shows: the count restarts wherever a list does. */
const numbering = (blocks: Block[]): number[] =>
  blocks.reduce<number[]>((runs, block, i) => {
    runs.push(block.type === "number" && blocks[i - 1]?.type === "number" ? runs[i - 1] + 1 : 1);
    return runs;
  }, []);

/**
 * The note's body, written as blocks.
 *
 * It is still markdown underneath — `onChange` is handed the serialized
 * document on every keystroke — so what the editor writes is what the agent and
 * every other reader of `content` already understand.
 */
export function BlockEditor({
  initial,
  onChange,
  onNewNote,
}: {
  initial: string;
  onChange: (markdown: string) => void;
  onNewNote: () => void;
}) {
  const doc = useBlockDoc(initial, onChange);
  const slash = useSlashMenu();
  const drag = useBlockDrag(doc.moveTo);
  const highlight = useBlockSelection();
  const edit = blockEditing(doc, slash, highlight, onNewNote);

  const numbers = numbering(doc.blocks);
  const last = doc.blocks[doc.blocks.length - 1];

  return (
    <div
      className="grid"
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        slash.close();
        highlight.clear();
      }}
    >
      {doc.blocks.map((block, index) => (
        <BlockRow
          key={block.id}
          block={block}
          dropEdge={drag.edgeFor(block.id)}
          dragging={drag.dragId === block.id}
          onAdd={() => slash.open(doc.insertAfter(block.id))}
          onDuplicate={() => doc.duplicate(block.id)}
          onMove={(delta) => doc.move(block.id, delta)}
          onDelete={() => doc.remove(block.id)}
          onDragStart={drag.start(block.id)}
          onDragEnd={drag.end}
          onDragOver={drag.over(block.id)}
          onDrop={drag.drop(block.id)}
        >
          <BlockBody
            block={block}
            number={numbers[index]}
            focusKey={doc.focus.id === block.id ? doc.focus.tick : 0}
            caret={doc.focus.caret}
            onChange={(text) => edit.change(block, text)}
            onToggle={() => doc.update(block.id, { done: !block.done })}
            onKeyDown={edit.keys(block, index)}
            onSelect={highlight.read(block.id)}
          />

          {slash.menu?.blockId === block.id && (
            <SlashMenu options={slash.options} active={slash.menu.active} onPick={edit.pick} />
          )}

          {highlight.selection?.blockId === block.id && (
            <SelectionToolbar
              blockId={block.id}
              type={block.type}
              start={highlight.selection.start}
              end={highlight.selection.end}
              x={highlight.selection.x}
              y={highlight.selection.y}
              onType={(type: BlockType) => {
                doc.convert(block.id, type);
                highlight.clear();
              }}
              onDone={highlight.clear}
            />
          )}
        </BlockRow>
      ))}

      {/* The usual click target under a document: the page carries on where you point at it. */}
      <button
        type="button"
        aria-label="Add a block"
        onClick={() => (last.text || last.type !== "text" ? doc.insertAfter(last.id) : doc.focusOn(last.id))}
        className="h-24 w-full cursor-text"
      />
    </div>
  );
}
