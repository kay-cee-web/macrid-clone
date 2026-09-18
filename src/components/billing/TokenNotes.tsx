import { Coins, KeyRound, TriangleAlert } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const NOTES: { Icon: typeof Coins; title: string; body: ReactNode }[] = [
  {
    Icon: Coins,
    title: "Each turn costs tokens",
    body: "Every reply shows what the turn charged and what's left, so the balance is never a surprise.",
  },
  {
    Icon: KeyRound,
    title: "Or bring your own key",
    body: (
      <>
        Add an Anthropic, OpenAI or Gemini key under{" "}
        <Link href="/agents/workbench/models" className="font-medium text-accent hover:underline">
          Models
        </Link>{" "}
        and turns on that provider run on it instead.
      </>
    ),
  },
  {
    Icon: TriangleAlert,
    title: "Running out loses nothing",
    body: "At zero the agent says so and stops charging. Agents, conversations, lists and records stay where they are.",
  },
];

/** What tokens are, said once, beside the tiers that sell them. */
export function TokenNotes() {
  return (
    <ul className="grid gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-3">
      {NOTES.map(({ Icon, title, body }) => (
        <li key={title} className="grid content-start gap-1.5 bg-surface p-4">
          <Icon aria-hidden className="size-4 text-accent" />
          <p className="text-sm font-medium text-ink">{title}</p>
          <p className="text-xs leading-relaxed text-muted">{body}</p>
        </li>
      ))}
    </ul>
  );
}
