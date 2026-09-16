const CLONE_SUFFIX = /\s+clone\s+(\d+)$/i;

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Name for a "New conversation" copy: "<name> clone <n>", with n one above the
 * highest clone of that name. Cloning a clone numbers from the original name,
 * so "Marlowe clone 1" gives "Marlowe clone 2", not "Marlowe clone 1 clone 1".
 */
export function conversationCopyName(name: string, existingNames: string[]) {
  const base = name.replace(CLONE_SUFFIX, "").trim() || name;
  const pattern = new RegExp(`^${escapeRegExp(base)}\\s+clone\\s+(\\d+)$`, "i");
  const highest = existingNames.reduce((max, existing) => {
    const match = existing.trim().match(pattern);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `${base} clone ${highest + 1}`;
}
