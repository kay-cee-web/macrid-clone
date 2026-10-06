import { CONNECTORS } from "@/data/connectors";
import { IDEAS } from "@/data/ideas";
import { ALL_MODELS } from "@/data/models";
import { ALL_SKILLS } from "@/data/skills";

/** 127 → "120+", so the figure stays true as the catalogues grow. Small counts stay exact. */
const atLeast = (count: number) => (count < 20 ? String(count) : `${Math.floor(count / 10) * 10}+`);

/** Product facts counted from the app's own catalogues, never usage or customer claims. */
const FACTS = [
  { value: Object.values(IDEAS).flat().length, label: "Ready-made workflows" },
  { value: CONNECTORS.length, label: "Apps to connect" },
  { value: ALL_SKILLS.length, label: "Agent skills" },
  { value: ALL_MODELS.length, label: "AI models" },
];

/** The row of figures along the foot of the sign-in artwork, as on Tapotik. */
export function ShowcaseFacts() {
  return (
    <dl className="grid grid-cols-4 gap-6">
      {FACTS.map(({ value, label }) => (
        <div key={label} className="grid gap-1">
          <dt className="order-2 text-xs text-muted">{label}</dt>
          <dd className="order-1 font-mono text-xl font-semibold text-accent">{atLeast(value)}</dd>
        </div>
      ))}
    </dl>
  );
}
