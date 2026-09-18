import { api } from "@/lib/api/client";
import { assertEnvelope } from "@/lib/api/errors";
import { toText } from "@/lib/api/pick";
import { nameFromEmail } from "@/lib/format";
import type { User } from "@/types/auth";

/** The account's own profile (Macrid's Settings → Account, same routes). */
export type ProfileFields = {
  name: string;
  username: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  /** Gallery URL of the avatar. */
  picture: string;
};

export const profileOf = (user: User | null): ProfileFields => ({
  name: toText(user?.name),
  // The endpoint rejects an empty username, so an account without one gets the address's handle.
  username: toText(user?.username) || nameFromEmail(toText(user?.email)).handle,
  email: toText(user?.email),
  phone: toText(user?.phone),
  city: toText(user?.city),
  country: toText(user?.country),
  picture: toText(user?.profile_pic),
});

/**
 * `POST /profile-update/{id}` is a full update behind a `_method: PUT` spoof, so
 * every field goes with every request — send only what changed and the rest
 * would be blanked. `picture` is a hosted gallery URL, not a file upload.
 */
export async function updateProfile(user: User, changes: Partial<ProfileFields>): Promise<void> {
  const next = { ...profileOf(user), ...changes };
  const form = new FormData();
  for (const field of ["name", "username", "email", "phone", "city", "country"] as const) {
    form.append(field, next[field]);
  }
  form.append("_method", "PUT");
  if (next.picture) form.append("picture", next.picture);

  const { data } = await api.post(`/profile-update/${user.id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  assertEnvelope(data, "Could not save your profile");
}

/** `PUT /password-update/{id}`: the new password goes in twice, as Macrid sends it. */
export async function changePassword(userId: number, current: string, next: string): Promise<void> {
  const { data } = await api.put(`/password-update/${userId}`, {
    current_password: current,
    new_password: next,
    password: next,
  });
  assertEnvelope(data, "Could not change your password");
}
