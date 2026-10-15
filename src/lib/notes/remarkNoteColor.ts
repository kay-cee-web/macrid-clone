/**
 * Renders the two pieces of HTML a note is allowed to contain: the colour span
 * and the `<u>` the editor writes, which markdown has no syntax for.
 *
 * react-markdown drops raw HTML unless it is told to render all of it, and
 * turning that on would render whatever an agent put in a reply as well. So the
 * open and close tags — which arrive as separate `html` nodes — are paired up
 * here and replaced by one node that becomes a `<span>` carrying the colour as
 * data. Nothing else in the note's HTML is honoured.
 */
type Node = {
  type: string;
  value?: string;
  children?: Node[];
  data?: { hName?: string; hProperties?: Record<string, string> };
};

const OPEN = /^<span style="color:(#[0-9a-fA-F]{3,8})">$/;

/** The tag an opening `html` node starts, its closing tag and what it renders as. */
function opening(value: string): { close: string; data: Node["data"] } | null {
  if (value === "<u>") return { close: "</u>", data: { hName: "u" } };
  // A reacted run reads as highlighted; the reactions themselves belong to the editor.
  if (/^<mark data-r="[^"]*">$/.test(value)) {
    return { close: "</mark>", data: { hName: "mark", hProperties: { className: "rounded-sm bg-warn-soft text-inherit" } } };
  }
  const color = OPEN.exec(value);
  return color ? { close: "</span>", data: { hName: "span", hProperties: { "data-color": color[1] } } } : null;
}

function paired(children: Node[]): Node[] {
  const out: Node[] = [];
  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];
    const open = child.type === "html" ? opening(child.value ?? "") : null;
    if (!open) {
      out.push(child);
      continue;
    }
    const close = children.findIndex((node, at) => at > i && node.type === "html" && node.value === open.close);
    if (close < 0) {
      out.push(child);
      continue;
    }
    out.push({ type: "noteColor", children: children.slice(i + 1, close), data: open.data });
    i = close;
  }
  return out;
}

function walk(node: Node) {
  if (!node.children) return;
  node.children = paired(node.children);
  node.children.forEach(walk);
}

export function remarkNoteColor() {
  return (tree: Node) => walk(tree);
}
