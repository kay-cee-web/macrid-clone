"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/hooks/useAuth";
import { firstName } from "@/lib/format";
import { MembersPanel } from "./MembersPanel";
import { PersonalPanel } from "./PersonalPanel";
import { SettingsRail, type SectionId } from "./SettingsRail";
import { AppearancePanel } from "./SettingsPanels";
import { KeysPanel, PlanPanel, WorkspacePanel } from "./WorkspacePanels";

/**
 * Account-wide settings. Only what the API actually exposes: the session, the
 * theme, the token balance and the AI keys. Agent settings stay on the agent.
 */
export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { user, signOut } = useAuth();
  const [section, setSection] = useState<SectionId>("workspace");
  const workspace = user ? `${firstName(user.name) || "Your"}'s workspace` : "Your workspace";

  return (
    <Modal open bare size="xl" title="Settings" onClose={onClose}>
      {/* One height for every section, so the box doesn't jump between them; the panel scrolls inside it. */}
      <div className="grid h-[85dvh] max-h-160 grid-rows-[auto_minmax(0,1fr)] sm:grid-cols-[232px_1fr] sm:grid-rows-1">
        <SettingsRail workspace={workspace} user={user} value={section} onChange={setSection} />

        <div className="relative min-h-0 min-w-0">
          {/* Outside the scroller, so it stays put however long the panel is. */}
          <IconButton label="Close" onClick={onClose} className="absolute right-3 top-3 z-10 bg-surface">
            <X />
          </IconButton>

          <div className="h-full overflow-y-auto px-5 py-5 sm:px-8 sm:py-7">
            {section === "workspace" && <WorkspacePanel name={workspace} user={user} onSignOut={() => void signOut()} />}
            {section === "members" && <MembersPanel user={user} />}
            {section === "plan" && <PlanPanel />}
            {section === "keys" && <KeysPanel onNavigate={onClose} />}
            {section === "personal" && user && <PersonalPanel user={user} onSignOut={() => void signOut()} />}
            {section === "appearance" && <AppearancePanel />}
          </div>
        </div>
      </div>
    </Modal>
  );
}
