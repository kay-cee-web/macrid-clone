import type { TokenUsage } from "@/types/agent";

const count = new Intl.NumberFormat("en");

/** "· 1,240 tokens" or "· your API key" beside a reply's time. */
export function TurnUsage({ usage }: { usage: TokenUsage }) {
  const label = usage.usingOwnKey
    ? "your API key"
    : usage.charged !== null
      ? `${count.format(usage.charged)} token${usage.charged === 1 ? "" : "s"}`
      : "";
  if (!label) return null;

  const title = usage.usingOwnKey
    ? "Paid by your own AI key; no Macrid tokens were used"
    : usage.remaining !== null
      ? `${count.format(usage.remaining)} tokens left after this reply`
      : undefined;

  return (
    <span className="font-mono text-[11px] text-faint" title={title}>
      · {label}
    </span>
  );
}
