/**
 * Asking an agent to write into a note.
 *
 * There is no writing endpoint, only an agent's chat, so the request goes out as
 * a chat turn and the reply comes back as markdown — the same markdown the block
 * editor reads and writes, so it drops straight into the note.
 */

type NoteText = { title: string; body: string };

/** Enough of the note for context without sending a book with every request. */
const CONTEXT_LIMIT = 12000;

/**
 * The turn sent to the agent. The agent has real tools (it can send email), so
 * the message says plainly that this is writing only, and asks for the text
 * alone — a "Sure, here's your doc!" would otherwise land in the note too.
 */
export function askAgentMessage(request: string, note: NoteText): string {
  const title = note.title.trim();
  const body = note.body.trim();
  const lines = [
    title ? `I'm writing in my note "${title}".` : "I'm writing a note.",
    request.trim(),
    "",
    "Reply with only the text to add to the note, as markdown: no greeting, no lead-in, no question back.",
    "This is writing only — don't send anything and don't create or change any records.",
  ];
  if (!title) lines.push("Start with a `# ` heading that can serve as the note's title.");
  if (body) {
    const context = body.length > CONTEXT_LIMIT ? `${body.slice(0, CONTEXT_LIMIT)}\n…` : body;
    lines.push("", "The note so far:", '"""', context, '"""');
  }
  return lines.join("\n");
}

/**
 * The note with the agent's text added after what's there. An untitled note
 * takes the reply's leading `# ` heading as its title, so it isn't left as
 * "Untitled note" over a heading that says what it is.
 */
export function withAgentDraft(note: NoteText, reply: string): NoteText {
  let text = reply.trim();
  let title = note.title;
  const heading = /^#\s+(.+)\n*/.exec(text);
  if (!title.trim() && heading) {
    title = heading[1].trim();
    text = text.slice(heading[0].length).trim();
  }
  const body = note.body.trim() ? `${note.body.trimEnd()}\n\n${text}` : text;
  return { title, body };
}
