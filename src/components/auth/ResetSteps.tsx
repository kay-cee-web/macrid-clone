"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CodeInput } from "@/components/ui/CodeInput";
import { PasswordField, TextField } from "@/components/ui/TextField";
import { useForm } from "@/hooks/useForm";
import { extractApiError } from "@/lib/api/errors";
import { reportFormError } from "@/lib/api/form-errors";
import { email as emailRule, password } from "@/lib/validation";
import { requestPasswordReset, resetPassword, verifyResetCode } from "@/services/auth";
import { ResendCode } from "./ResendCode";

/** Wraps an async submit with a busy flag; errors are left to the caller. */
function useSubmit() {
  const [busy, setBusy] = useState(false);
  const run = async (task: () => Promise<void>) => {
    setBusy(true);
    try {
      await task();
    } finally {
      setBusy(false);
    }
  };
  return { busy, run };
}

export function ResetEmailStep({ onSent }: { onSent: (email: string) => void }) {
  const form = useForm({ email: "" });
  const { busy, run } = useSubmit();

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.validate({ email: emailRule })) return;
    const address = form.values.email.trim();
    void run(async () => {
      try {
        await requestPasswordReset(address);
        onSent(address);
      } catch (err) {
        reportFormError(err, { fallback: "Could not send a reset code", setErrors: form.setErrors });
      }
    });
  };

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-4">
      <TextField id="email" label="Email" type="email" autoComplete="email" leading={<Mail />} {...form.bind("email")} />
      <Button type="submit" size="lg" block loading={busy}>
        Send code
      </Button>
    </form>
  );
}

export function ResetCodeStep({ email, onVerified }: { email: string; onVerified: (code: string) => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { busy, run } = useSubmit();

  const submit = (value = code) => {
    if (value.length !== 6) return setError("Enter all 6 digits.");
    void run(async () => {
      try {
        await verifyResetCode(email, value);
        onVerified(value);
      } catch (err) {
        setError(extractApiError(err, "That code is invalid or has expired."));
        setCode("");
      }
    });
  };

  return (
    <form noValidate onSubmit={(e) => (e.preventDefault(), submit())} className="grid gap-4">
      <CodeInput
        id="code"
        label="Reset code"
        value={code}
        invalid={Boolean(error)}
        disabled={busy}
        onChange={(value) => (setCode(value), setError(""))}
        onComplete={submit}
      />
      {error && <p role="alert" className="text-[12.5px] text-bad">{error}</p>}
      <Button type="submit" size="lg" block loading={busy}>
        Continue
      </Button>
      <ResendCode startCoolingDown send={() => requestPasswordReset(email)} />
    </form>
  );
}

export function ResetPasswordStep({ email, code, onDone }: { email: string; code: string; onDone: () => void }) {
  const form = useForm({ password: "", confirm: "" });
  const { busy, run } = useSubmit();

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const valid = form.validate({
      password,
      confirm: (v, all) => (v !== all.password ? "Passwords don't match." : undefined),
    });
    if (!valid) return;
    void run(async () => {
      try {
        await resetPassword({ email, code, password: form.values.password });
        onDone();
      } catch (err) {
        reportFormError(err, { fallback: "Could not reset your password", setErrors: form.setErrors });
      }
    });
  };

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-4">
      <PasswordField id="password" label="New password" autoComplete="new-password" {...form.bind("password")} />
      <PasswordField id="confirm" label="Confirm new password" autoComplete="new-password" {...form.bind("confirm")} />
      <Button type="submit" size="lg" block loading={busy}>
        Update password
      </Button>
    </form>
  );
}
