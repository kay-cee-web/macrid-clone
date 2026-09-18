"use client";

import { useSearchParams } from "next/navigation";
import { PlanPanel } from "@/components/billing/PlanPanel";
import { useAuth } from "@/hooks/useAuth";
import { firstName } from "@/lib/format";
import { MembersPanel } from "./MembersPanel";
import { PersonalPanel } from "./PersonalPanel";
import { SECTION_IDS, SettingsRail, type SectionId } from "./SettingsRail";
import { AppearancePanel } from "./SettingsPanels";
import { KeysPanel, WorkspacePanel } from "./WorkspacePanels";

/**
 * Account-wide settings at `/settings?section=…`. Only what the API actually
 * exposes: the session, the theme, the members and the AI keys. Agent settings
 * stay on the agent.
 */
export function AccountSettings() {
  const { user, signOut } = useAuth();
  const requested = useSearchParams().get("section");
  const section: SectionId = SECTION_IDS.includes(requested as SectionId) ? (requested as SectionId) : "workspace";
  const workspace = user ? `${firstName(user.name) || "Your"}'s workspace` : "Your workspace";

  return (
    /* Same container as the agent's settings, so the two read as one product. */
    <div className="mx-auto grid w-full max-w-400 gap-6 px-4 pb-16 pt-8 sm:px-6 md:grid-cols-[232px_minmax(0,1fr)] md:gap-10 xl:px-10">
      <SettingsRail workspace={workspace} user={user} value={section} />

      <div className="min-w-0">
        {section === "workspace" && <WorkspacePanel name={workspace} user={user} onSignOut={() => void signOut()} />}
        {section === "members" && <MembersPanel user={user} />}
        {section === "plan" && <PlanPanel />}
        {section === "keys" && <KeysPanel />}
        {section === "personal" && user && <PersonalPanel user={user} onSignOut={() => void signOut()} />}
        {section === "appearance" && <AppearancePanel />}
      </div>
    </div>
  );
}
