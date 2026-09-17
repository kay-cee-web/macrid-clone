"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Modal } from "@/components/ui/Modal";
import { PasswordField } from "@/components/ui/TextField";
import { AI_PROVIDER_BY_ID } from "@/data/aiProviders";
import type { ModelOption } from "@/data/models";
import { extractApiError, fieldErrors } from "@/lib/api/errors";
import { removeAiKey, saveAiKey } from "@/services/aiKeys";
import type { AiKeyState } from "@/types/aiKey";
import { ProviderLogo } from "./ProviderLogo";

type IntegrateModalProps = {
  model: ModelOption;
  keyState: AiKeyState | null;
  onClose: () => void;
  /** Re-read the keys after a save or removal. */
  onChanged: () => void;
};

/** Add, replace or remove the user's own key for a model's provider. */
export function IntegrateModal({ model, keyState, onClose, onChanged }: IntegrateModalProps) {
  const provider = AI_PROVIDER_BY_ID[model.provider];
  const connected = Boolean(keyState?.connected);
  const [apiKey, setApiKey] = useState("");
  const [makeDefault, setMakeDefault] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!apiKey.trim()) return setError(`Paste your ${provider.name} API key.`);
    setSaving(true);
    try {
      await saveAiKey({
        provider: model.provider,
        apiKey,
        model: makeDefault ? model.id : keyState?.model,
        recordId: keyState?.recordId ?? null,
      });
      toast.success(makeDefault ? `${model.name} is now your default ${provider.name} model.` : `${provider.name} key saved.`);
      onChanged();
      onClose();
    } catch (err) {
      setError(fieldErrors(err).api_key ?? "");
      toast.error(extractApiError(err, `Could not save your ${provider.name} key`));
      setSaving(false);
    }
  }

  async function remove() {
    if (!keyState) return false;
    try {
      await removeAiKey(model.provider, keyState);
      toast.success(`${provider.name} key removed. Agents go back to Dexisphere's models.`);
      onChanged();
      onClose();
      return true;
    } catch (err) {
      toast.error(extractApiError(err, `Could not remove your ${provider.name} key`));
      return false;
    }
  }

  if (confirmRemove) {
    return (
      <ConfirmModal
        title={`Remove your ${provider.name} key?`}
        description={`Agents on ${provider.name} models stop using your key and run on your plan's tokens again.`}
        confirmLabel="Remove key"
        onConfirm={remove}
        onClose={() => setConfirmRemove(false)}
      />
    );
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={connected ? `Manage ${provider.name} key` : `Integrate ${model.name}`}
      description={
        connected
          ? `Your ${provider.name} key${keyState?.hint ? ` (${keyState.hint})` : ""} is connected. Paste a new one to replace it.`
          : `Add your own ${provider.name} API key. Agents on ${provider.name} models then run on your key instead of your plan's tokens.`
      }
    >
      <form onSubmit={onSubmit} className="grid gap-5" noValidate>
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-raised/60 p-3">
          <ProviderLogo provider={model.provider} className="size-10 rounded-lg" />
          <div className="grid min-w-0">
            <span className="truncate font-medium">{model.name}</span>
            <span className="truncate font-mono text-xs text-faint">{model.id}</span>
          </div>
        </div>

        <PasswordField
          id="ai-api-key"
          label={`${provider.name} API key`}
          placeholder={provider.keyPlaceholder}
          autoComplete="off"
          value={apiKey}
          error={error}
          onChange={(event) => {
            setApiKey(event.target.value);
            setError("");
          }}
          hint={
            <>
              Create one at{" "}
              <a href={provider.keyUrl} target="_blank" rel="noreferrer" className="text-accent underline-offset-2 hover:underline">
                {provider.keyUrlLabel}
              </a>
              .
            </>
          }
        />

        <Checkbox
          id="ai-make-default"
          checked={makeDefault}
          onChange={(event) => setMakeDefault(event.target.checked)}
          label={`Make ${model.name} my default ${provider.name} model`}
        />

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {connected && (
            <Button variant="danger" onClick={() => setConfirmRemove(true)}>
              Remove key
            </Button>
          )}
          <Button variant="ghost" onClick={onClose} className="ml-auto">
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {connected ? "Replace key" : "Save key"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
