"use client";

import { ConnectorLogo } from "@/components/plugins/ConnectorLogo";
import { Checkbox } from "@/components/ui/Checkbox";
import { CONNECTORS_BY_KEY } from "@/data/connectors";
import type { SocialAccount } from "@/types/social";

type Props = { accounts: SocialAccount[]; picked: string[]; onChange: (ids: string[]) => void };

/** The posting accounts to send to. One that needs reconnecting is shown but can't be picked. */
export function PostAccountPicker({ accounts, picked, onChange }: Props) {
  const toggle = (id: string) => onChange(picked.includes(id) ? picked.filter((p) => p !== id) : [...picked, id]);

  return (
    <fieldset className="grid gap-2">
      <legend className="mb-1.5 text-sm font-medium text-ink">Post to</legend>
      {accounts.length === 0 ? (
        <p className="text-sm text-muted">No posting account is connected. Connect one under Connected accounts first.</p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {accounts.map((account) => {
            const connector = CONNECTORS_BY_KEY[account.platform];
            return (
              <li key={account.id} className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-2.5">
                {connector && <ConnectorLogo connector={connector} className="size-6 rounded-md" />}
                <Checkbox
                  id={`post-account-${account.id}`}
                  checked={picked.includes(account.id)}
                  disabled={Boolean(account.problem)}
                  onChange={() => toggle(account.id)}
                  label={
                    <span className="grid">
                      <span className="text-ink">{account.name || connector?.name || account.platform}</span>
                      {account.problem && <span className="text-xs text-warn">{account.problem}</span>}
                    </span>
                  }
                />
              </li>
            );
          })}
        </ul>
      )}
    </fieldset>
  );
}
