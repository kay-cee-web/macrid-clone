/**
 * Agents quote record ids in plain text ("Its list ID is 168"). Turn those
 * into links to the Records page. Lists are the only records with their own
 * page, so only list ids are linked. Code spans and existing links are skipped.
 */
const LIST_ID = /\b(list\s+(?:ID\s*(?:is\s+|:\s*|=\s*|#\s*)?|#)(\d+))\b/gi;
const SKIP = /(`[^`]*`|\[[^\]]*\]\([^)]*\))/;

export function linkRecordMentions(markdown: string) {
  return markdown
    .split(SKIP)
    .map((part, index) => (index % 2 === 1 ? part : part.replace(LIST_ID, (_, label, id) => `[${label}](/records/lists/${id})`)))
    .join("");
}
