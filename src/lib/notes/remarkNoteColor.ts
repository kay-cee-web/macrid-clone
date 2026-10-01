/**
 * Renders the one piece of HTML a note is allowed to contain: the colour span
 * the editor writes, which markdown has no syntax for.
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
const CLOSE = "</span>";

function paired(children: Node[]): Node[] {
  const out: Node[] = [];
  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];
    const open = child.type === "html" ? OPEN.exec(child.value ?? "") : null;
    if (!open) {
      out.push(child);
      continue;
    }
    const close = children.findIndex((node, at) => at > i && node.type === "html" && node.value === CLOSE);
    if (close < 0) {
      out.push(child);
      continue;
    }
    out.push({
      type: "noteColor",
      children: children.slice(i + 1, close),
      data: { hName: "span", hProperties: { "data-color": open[1] } },
    });
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
