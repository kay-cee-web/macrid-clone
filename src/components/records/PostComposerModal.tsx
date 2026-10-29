"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { extractApiError } from "@/lib/api/errors";
import { POST_LIMITS, problemWith, toDraft, toLocalInput, type PostFormValues, type PostTiming } from "@/lib/social/postForm";
import { createSocialPost, updateSocialPost } from "@/services/social";
import type { SocialAccount, SocialPost } from "@/types/social";
import { PostAccountPicker } from "./PostAccountPicker";

type Props = {
  /** Set when editing; a new post otherwise. */
  post?: SocialPost;
  accounts: SocialAccount[];
  onClose: () => void;
  onSaved: () => void;
};

const SAVE_LABEL: Record<PostTiming, string> = { draft: "Save draft", schedule: "Schedule", now: "Publish now" };

/** Write a post for one or more accounts, or change a draft or scheduled one. Toasts the backend's own message. */
export function PostComposerModal({ post, accounts, onClose, onSaved }: Props) {
  const [values, setValues] = useState<PostFormValues>({
    body: post?.body ?? "",
    media: post?.media.join("\n") ?? "",
    link: post?.link ?? "",
    timing: post?.status === "scheduled" ? "schedule" : "draft",
    when: toLocalInput(post?.scheduledFor ?? ""),
  });
  const [picked, setPicked] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (key: keyof PostFormValues) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [key]: e.target.value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    const problem = problemWith(values, picked.length, !post);
    if (problem) return setError(problem);
    setSaving(true);
    setError("");
    try {
      const message = post
        ? await updateSocialPost(post.id, toDraft(values))
        : await createSocialPost(picked, toDraft(values), values.timing === "now");
      // PUT answers without a message, so an edit says it plainly.
      toast.success(message || "Post updated.");
      onSaved();
    } catch (err) {
      const message = extractApiError(err, "Could not save the post");
      setError(message);
      toast.error(message);
      setSaving(false);
    }
  }

  return (
    <Modal open size="lg" onClose={onClose} title={post ? "Edit post" : "New post"} description={post ? "Drafts and scheduled posts can change until they go out." : "One post per account, so each can go out or fail on its own."}>
      <form onSubmit={submit} className="grid gap-4" noValidate>
        {error && <Alert>{error}</Alert>}
        {!post && <PostAccountPicker accounts={accounts} picked={picked} onChange={setPicked} />}
        <Field id="post-body" label="Post" hint={`${values.body.length.toLocaleString()} / ${POST_LIMITS.body.toLocaleString()}`}>
          <Textarea id="post-body" rows={5} value={values.body} onChange={set("body")} maxLength={POST_LIMITS.body} />
        </Field>
        <Field id="post-media" label="Image links" hint={`Hosted image URLs, one per line. Up to ${POST_LIMITS.media}.`}>
          <Textarea id="post-media" rows={2} value={values.media} onChange={set("media")} className="font-mono text-xs sm:text-xs" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="post-link" label="Link (optional)">
            <Input id="post-link" type="url" value={values.link} onChange={set("link")} placeholder="https://" />
          </Field>
          <Field id="post-timing" label="When">
            <Select id="post-timing" value={values.timing} onChange={set("timing")}>
              <option value="draft">Keep as a draft</option>
              <option value="schedule">Schedule</option>
              {!post && <option value="now">Publish now</option>}
            </Select>
          </Field>
        </div>
        {values.timing === "schedule" && (
          <Field id="post-when" label="Goes out at" hint="Your local time.">
            <Input id="post-when" type="datetime-local" value={values.when} onChange={set("when")} />
          </Field>
        )}
        <div className="flex flex-wrap justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>{post ? "Save" : SAVE_LABEL[values.timing]}</Button>
        </div>
      </form>
    </Modal>
  );
}
