"use client";

import type { Ref, SetStateAction } from "react";
import { TaskComposer } from "@/components/agents/TaskComposer";
import { useAttachments } from "@/hooks/useAttachments";
import type { ChatImage } from "@/types/agent";
import { AttachButton, AttachmentList } from "./AttachmentControls";

type ComposerWithAttachmentsProps = {
  id: string;
  label: string;
  value: string;
  onChange: (next: SetStateAction<string>) => void;
  /** Return true when the message was accepted, so the draft and images clear. */
  onSubmit: (text: string, images: ChatImage[]) => boolean | Promise<boolean>;
  submitLabel: string;
  submitting?: boolean;
  disabled?: boolean;
  placeholder?: string;
  initialImageUrls?: string[];
  textareaRef?: Ref<HTMLTextAreaElement>;
  className?: string;
};

/** TaskComposer plus image uploads. Used by the Agents home and the chat. */
export function ComposerWithAttachments({
  onSubmit, submitting, disabled, initialImageUrls, onChange, ...rest
}: ComposerWithAttachmentsProps) {
  const attachments = useAttachments(initialImageUrls);

  return (
    <TaskComposer
      {...rest}
      onChange={onChange}
      submitting={submitting || attachments.uploading}
      submitDisabled={disabled}
      header={<AttachmentList items={attachments.items} onRemove={attachments.remove} />}
      tools={<AttachButton onFiles={attachments.add} disabled={attachments.full} />}
      onSubmit={async (text) => {
        const images = attachments.images;
        const accepted = await onSubmit(text, images);
        if (accepted) {
          onChange("");
          attachments.clear();
        }
      }}
    />
  );
}
