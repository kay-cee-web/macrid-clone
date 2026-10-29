import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** A multi-line input styled to match `Input`; grows by hand (resize-y). */
export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full resize-y rounded-[10px] border border-line bg-surface px-3 py-2.5 text-base leading-relaxed text-ink outline-none transition-colors sm:text-sm",
        "hover:border-faint focus:border-accent focus:ring-3 focus:ring-accent-soft",
        className,
      )}
      {...rest}
    />
  );
}
