"use client";

import { CircleHelp, Plug } from "lucide-react";
import { ideasFor } from "@/data/ideas";
import { coverOf } from "@/data/ideas/covers";
import type { Suggestion } from "@/types/suggestion";
import { SuggestionList } from "./SuggestionList";

const FROM_CATALOGUE = 2;

/** Asked of every agent, whatever its job: what it can reach, and what it can do. */
const STANDING: Suggestion[] = [
  { label: "Connect the tools I use for this work", text: "Check which of my tools are connected and tell me what to connect for this work.", Icon: Plug },
  { label: "Tell me what you can do", text: "Tell me what you can do for me.", Icon: CircleHelp },
];

type GreetingSuggestionsProps = {
  category?: string;
  onPick: (text: string) => void;
  disabled?: boolean;
};

/** The greeting's starting points: two tasks the agent can finish today, then the standing questions. */
export function GreetingSuggestions({ category, onPick, disabled }: GreetingSuggestionsProps) {
  const tasks: Suggestion[] = ideasFor(category)
    .filter((idea) => idea.ready && !idea.blocked)
    .slice(0, FROM_CATALOGUE)
    .map((idea) => ({ label: idea.title, text: idea.description, Icon: coverOf(idea.category).Icon }));

  return <SuggestionList items={[...tasks, ...STANDING]} onPick={onPick} disabled={disabled} />;
}
