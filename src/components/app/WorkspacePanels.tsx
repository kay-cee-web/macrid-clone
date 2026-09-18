"use client";

import Link from "next/link";
import { CreditCard, ExternalLink, LogOut } from "lucide-react";
import { SettingRow } from "@/components/settings/SettingsSection";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonStyles } from "@/components/ui/button-styles";
import { dexisphereAppLink } from "@/lib/config";
import { initialsOf } from "@/lib/format";
import type { User } from "@/types/auth";
import { PanelHeading, Rows } from "./SettingsPanels";

const SETTINGS = dexisphereAppLink("/settings");

function AppLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={buttonStyles({ variant: "secondary", size: "sm" })}>
      <ExternalLink className="size-3.5" />
      {children}
    </a>
  );
}

/** Named after the account: there is no workspace endpoint to rename or leave. */
export function WorkspacePanel({ name, user, onSignOut }: { name: string; user: User | null; onSignOut: () => void }) {
  return (
    <div className="grid gap-6">
      <PanelHeading title="Workspace settings" description="Everything your agents create belongs to this workspace." />

      <div className="grid justify-items-center gap-3 rounded-2xl border border-line bg-raised/40 px-6 py-8">
        <span className="grid size-14 place-items-center rounded-2xl bg-accent text-xl font-semibold text-accent-ink shadow-float">
          {user ? initialsOf(user.name).slice(0, 1) : "?"}
        </span>
        <p className="text-base font-medium text-ink">{name}</p>
        <p className="max-w-[46ch] text-center text-sm text-muted">
          Private to your account. Sharing a workspace isn&apos;t something the API offers yet.
        </p>
      </div>

      <Rows>
        <SettingRow label="Avatar" description="Taken from your account initial.">
          <span className="grid size-9 place-items-center rounded-lg bg-accent text-sm font-semibold text-accent-ink">
            {user ? initialsOf(user.name).slice(0, 1) : "?"}
          </span>
        </SettingRow>
        <SettingRow label="Name" description="Follows the name on your account.">
          <span className="text-sm text-muted">{name}</span>
          <AppLink href={SETTINGS}>Edit</AppLink>
        </SettingRow>
        <SettingRow label="Sign out" description="Ends this session in this browser.">
          <Button variant="secondary" size="sm" icon={<LogOut className="size-3.5" />} onClick={onSignOut}>
            Sign out
          </Button>
        </SettingRow>
      </Rows>
    </div>
  );
}

/** Billing has no route here yet; the plan itself is managed in the Dexisphere app. */
export function PlanPanel() {
  return (
    <div className="grid gap-6">
      <PanelHeading title="Plan and billing" description="Your plan, invoices and payment method." />
      <EmptyState
        icon={<CreditCard />}
        title="Coming soon"
        description="Billing isn't part of this workspace yet. Until it lands, your plan and tokens are managed in the Dexisphere app."
        action={<AppLink href={dexisphereAppLink("/settings/plans")}>Manage plan</AppLink>}
      />
    </div>
  );
}

export function KeysPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid gap-6">
      <PanelHeading
        title="API keys"
        description="Bring your own Anthropic, OpenAI or Gemini key and agents on that provider run on it instead of your plan's tokens."
      />
      <Rows>
        <SettingRow label="AI providers" description="Add or remove a key from the model catalogue.">
          <Link href="/agents/workbench/models" onClick={onNavigate} className={buttonStyles({ variant: "secondary", size: "sm" })}>
            Models
          </Link>
        </SettingRow>
        <SettingRow label="Connectors" description="Mailboxes, Twilio and Google keys are set up per agent, under Plugins.">
          <AppLink href={dexisphereAppLink("/settings")}>Dexisphere</AppLink>
        </SettingRow>
      </Rows>
    </div>
  );
}
