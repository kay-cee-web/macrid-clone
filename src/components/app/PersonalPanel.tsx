"use client";

import { useState } from "react";
import { KeyRound, LogOut } from "lucide-react";
import { toast } from "sonner";
import { EditableRow } from "@/components/settings/EditableRow";
import { SettingRow } from "@/components/settings/SettingsSection";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { useAuth } from "@/hooks/useAuth";
import { profileOf, updateProfile, type ProfileFields } from "@/services/profile";
import type { User } from "@/types/auth";
import { PasswordModal } from "./PasswordModal";
import { PanelHeading, Rows } from "./SettingsPanels";
import { ProfileImageRow } from "./ProfileImageRow";

/**
 * The account's own profile. Everything here is a full `POST /profile-update`,
 * so each row sends its change on top of the stored profile.
 */
export function PersonalPanel({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  const { refreshUser } = useAuth();
  const [changingPassword, setChangingPassword] = useState(false);
  const profile = profileOf(user);

  const save = (field: keyof ProfileFields) => async (value: string) => {
    await updateProfile(user, { [field]: value });
    await refreshUser();
    toast.success("Profile saved.");
  };

  return (
    <div className="grid gap-6">
      <PanelHeading title="Personal settings" description="Your details and how you're signed in to Dexisphere." />

      <Rows>
        <ProfileImageRow user={user} onSaved={refreshUser} />
        <EditableRow
          label="Name"
          description="Your display name across the app."
          value={profile.name}
          required
          onSave={save("name")}
        />
        <EditableRow
          label="Username"
          description="The handle on your account."
          value={profile.username}
          placeholder="yourname"
          required
          onSave={save("username")}
        />
        <SettingRow label="Email" description={profile.email || "No address on this account."}>
          {user.email_verified_at ? (
            <Pill tone="good" dot>
              Verified
            </Pill>
          ) : (
            <Pill tone="warn" dot>
              Unverified
            </Pill>
          )}
        </SettingRow>
        <EditableRow
          label="Phone"
          description="Used on your records, not for signing in."
          value={profile.phone}
          type="tel"
          placeholder="+1 555 0100"
          onSave={save("phone")}
        />
        <EditableRow label="City" description="Where you're based." value={profile.city} onSave={save("city")} />
        <EditableRow label="Country" description="Your country." value={profile.country} onSave={save("country")} />
        <SettingRow label="Password" description="At least 8 characters. You'll need your current one.">
          <Button
            variant="secondary"
            size="sm"
            icon={<KeyRound className="size-3.5" />}
            onClick={() => setChangingPassword(true)}
          >
            Change
          </Button>
        </SettingRow>
        <SettingRow label="Sign out" description="Ends this session in this browser.">
          <Button variant="secondary" size="sm" icon={<LogOut className="size-3.5" />} onClick={onSignOut}>
            Sign out
          </Button>
        </SettingRow>
      </Rows>

      <p className="text-xs text-muted">
        Your email is fixed: the account is keyed to it and there&apos;s no route to change it.
      </p>

      {changingPassword && <PasswordModal userId={user.id} onClose={() => setChangingPassword(false)} />}
    </div>
  );
}
