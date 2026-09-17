import { cn } from "@/lib/cn";
import { initialsOf } from "@/lib/format";

const sizes = {
  xs: "size-5 rounded-[6px] text-xs",
  sm: "size-7 rounded-[8px] text-xs",
  md: "size-9 rounded-[10px] text-xs",
  lg: "size-12 rounded-[14px] text-base",
};

/** Mono initials on the accent tint: an agent is always the teal thing on screen. */
export function AgentAvatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center bg-accent-soft font-mono font-medium text-accent",
        sizes[size],
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
