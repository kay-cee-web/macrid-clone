"use client";

import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { SettingRow } from "@/components/settings/SettingsSection";
import { Button } from "@/components/ui/Button";
import { extractApiError } from "@/lib/api/errors";
import { IMAGE_ACCEPT, IMAGE_MAX_BYTES, formatBytes, isAllowedImage } from "@/lib/files";
import { initialsOf } from "@/lib/format";
import { uploadToGallery } from "@/services/gallery";
import { updateProfile } from "@/services/profile";
import type { User } from "@/types/auth";

/**
 * The avatar saves on its own: picking a picture uploads it to the gallery and
 * sends the URL, so changing it never means editing the rest of the profile.
 */
export function ProfileImageRow({ user, onSaved }: { user: User; onSaved: () => Promise<unknown> }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const picture = typeof user.profile_pic === "string" ? user.profile_pic.trim() : "";

  async function pick(file: File | undefined) {
    if (!file) return;
    if (!isAllowedImage(file)) return void toast.error(`${file.name} isn't an image we can upload.`);
    if (file.size > IMAGE_MAX_BYTES) {
      return void toast.error(`${file.name} is ${formatBytes(file.size)}. Images must be under ${formatBytes(IMAGE_MAX_BYTES)}.`);
    }

    setBusy(true);
    try {
      const { url } = await uploadToGallery(file);
      await updateProfile(user, { picture: url });
      await onSaved();
      toast.success("Profile picture updated.");
    } catch (err) {
      toast.error(extractApiError(err, "Could not update your picture"));
    }
    setBusy(false);
  }

  return (
    <SettingRow label="Profile image" description="Shown on your account menu and beside your name.">
      <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-accent text-sm font-semibold text-accent-ink">
        {picture ? (
          // eslint-disable-next-line @next/next/no-img-element -- hosted user uploads on another domain
          <img src={picture} alt="" className="size-11 object-cover" />
        ) : (
          initialsOf(user.name)
        )}
      </span>
      <Button
        variant="secondary"
        size="sm"
        loading={busy}
        iconRight={<Camera className="size-3.5" />}
        onClick={() => input.current?.click()}
      >
        {picture ? "Change" : "Upload"}
      </Button>
      <input
        ref={input}
        type="file"
        accept={IMAGE_ACCEPT}
        className="hidden"
        onChange={(event) => {
          void pick(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
    </SettingRow>
  );
}
