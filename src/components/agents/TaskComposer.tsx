"use client";

import type { KeyboardEvent, ReactNode, Ref, SetStateAction } from "react";
import { ArrowUp, Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { IconButton } from "@/components/ui/IconButton";
import { Spinner } from "@/components/ui/Spinner";
import { useDictation } from "@/hooks/useDictation";
import { cn } from "@/lib/cn";

type TaskComposerProps = {
  id: string;
  label: string;
  value: string;
  onChange: (next: SetStateAction<string>) => void;
  onSubmit: (value: string) => void | Promise<void>;
  submitLabel: string;
  submitting?: boolean;
  /** Block sending without the spinner (e.g. while history loads). */
  submitDisabled?: boolean;
  placeholder?: string;
  /** Extra controls on the left of the bar (attachments, chips). */
  tools?: ReactNode;
  /** Shown above the text (e.g. attachment thumbnails). */
  header?: ReactNode;
  textareaRef?: Ref<HTMLTextAreaElement>;
  className?: string;
};

/** The floating input used to hand an agent work: Enter sends, Shift+Enter adds a line. */
export function TaskComposer({
  id, label, value, onChange, onSubmit, submitLabel, submitting, submitDisabled, placeholder, tools, header, textareaRef, className,
}: TaskComposerProps) {
  const dictation = useDictation({
    onText: (text) => onChange((prev) => (prev.trim() ? `${prev.trimEnd()} ${text}` : text)),
    onError: (message) => toast.error(message),
  });
  const canSubmit = value.trim().length > 0 && !submitting && !submitDisabled;

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      if (canSubmit) void onSubmit(value);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (canSubmit) void onSubmit(value);
      }}
      className={cn(
        "grid gap-3 rounded-3xl border border-line bg-surface p-4 shadow-float",
        "transition-[border-color,box-shadow] focus-within:border-accent/40 focus-within:shadow-glow",
        className,
      )}
    >
      {header}
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <textarea
        id={id}
        ref={textareaRef}
        value={value}
        rows={2}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        className="field-sizing-content max-h-60 min-h-16 w-full resize-none bg-transparent px-1 text-base leading-relaxed text-ink outline-none placeholder:text-faint"
      />
      <div className="flex items-center gap-2">
        {tools}
        <span className="ml-auto" />
        {dictation.supported && (
          <IconButton
            label={dictation.listening ? "Stop dictation" : "Dictate"}
            onClick={dictation.toggle}
            className={cn("size-10 rounded-full", dictation.listening && "bg-accent-soft text-accent")}
          >
            {dictation.listening ? <MicOff /> : <Mic />}
          </IconButton>
        )}
        <button
          type="submit"
          aria-label={submitLabel}
          title={submitLabel}
          disabled={!canSubmit}
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-full bg-accent text-accent-ink transition-colors hover:bg-accent-hover",
            "disabled:pointer-events-none disabled:bg-raised disabled:text-faint",
            submitting && "disabled:bg-accent disabled:text-accent-ink",
          )}
        >
          {submitting ? <Spinner label={submitLabel} /> : <ArrowUp className="size-5" />}
        </button>
      </div>
    </form>
  );
}
