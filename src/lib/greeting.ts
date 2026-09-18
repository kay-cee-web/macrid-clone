export type DayPart = "morning" | "afternoon" | "evening" | "night";

/** The viewer's own clock decides; night runs from 22:00 through 05:00. */
export function dayPartOf(date = new Date()): DayPart {
  const hour = date.getHours();
  if (hour < 5) return "night";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 22) return "evening";
  return "night";
}

/** "Good morning", for greetings that only need the salutation. */
export function salutationOf(part: DayPart): string {
  if (part === "night") return "Working late";
  if (part === "morning") return "Good morning";
  if (part === "afternoon") return "Good afternoon";
  return "Good evening";
}

/**
 * Home's headline. `who` is ", Evan" or "", so each line reads either way.
 * Several per part, picked at random on mount, so the page doesn't say the
 * same thing every visit.
 */
const HEADLINES: Record<DayPart, Array<(who: string) => string>> = {
  morning: [
    (who) => `Good morning${who}. What should your agent start with?`,
    () => `What's first on the list this morning?`,
    (who) => `Morning${who}. What can your agent take off your hands?`,
    () => `What should your agent do today?`,
  ],
  afternoon: [
    (who) => `Good afternoon${who}. What's next?`,
    () => `What should your agent pick up this afternoon?`,
    () => `What's still left on today's list?`,
    (who) => `Afternoon${who}. What should your agent handle?`,
  ],
  evening: [
    (who) => `Good evening${who}. What should your agent finish tonight?`,
    () => `Anything to set running before you sign off?`,
    () => `What should your agent wrap up this evening?`,
    (who) => `Evening${who}. What's left to hand over?`,
  ],
  night: [
    (who) => `Working late${who}. What should your agent take on?`,
    () => `What should your agent run overnight?`,
    (who) => `Still up${who}? Hand the next job to an agent.`,
    () => `Quiet hours. What should your agent work through?`,
  ],
};

/** The neutral line, used until the client's clock is known. */
export const DEFAULT_HEADLINE = "What should your agent do today?";

/**
 * `part` is null before mount, because the server doesn't know the viewer's
 * time zone. `seed` is any number in [0, 1); it keeps the pick stable while
 * the tab stays open.
 */
export function headlineFor(part: DayPart | null, name = "", seed = 0): string {
  if (!part) return DEFAULT_HEADLINE;
  const lines = HEADLINES[part];
  const line = lines[Math.min(lines.length - 1, Math.floor(seed * lines.length))];
  return line(name ? `, ${name}` : "");
}
