"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { CodeInput } from "@/components/ui/CodeInput";
import { useAuth } from "@/hooks/useAuth";
import { extractApiError } from "@/lib/api/errors";
import { resendVerification, verifyEmail } from "@/services/auth";
import { AuthHeading, AuthSwitch } from "./AuthHeading";
import { ResendCode } from "./ResendCode";

const CODE_LENGTH = 6;

export function VerifyEmailForm() {
  const { user, refreshUser, signOut } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;
  const account = user;

  async function submit(value = code) {
    if (value.length !== CODE_LENGTH) {
      setError(`Enter all ${CODE_LENGTH} digits.`);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await verifyEmail({ email: account.email, code: value, userId: account.id });
      toast.success("Email verified. Welcome to Macrid Agents.");
      await refreshUser();
    } catch (err) {
      setError(extractApiError(err, "That code is invalid or has expired."));
      setCode("");
      setSubmitting(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void submit();
  }

  return (
    <>
      <AuthHeading
        title="Check your inbox"
        description={
          <>
            Enter the 6-digit code we sent to <span className="font-medium text-ink">{account.email}</span>.
          </>
        }
      />
      <form noValidate onSubmit={onSubmit} className="grid gap-4">
        <CodeInput
          id="code"
          label="Verification code"
          value={code}
          length={CODE_LENGTH}
          invalid={Boolean(error)}
          disabled={submitting}
          onChange={(value) => {
            setCode(value);
            if (error) setError("");
          }}
          onComplete={(value) => void submit(value)}
        />
        {error && (
          <p role="alert" className="text-[12.5px] text-bad">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" block loading={submitting}>
          Verify email
        </Button>
        <ResendCode send={() => resendVerification(account.email)} />
      </form>
      <AuthSwitch>
        Wrong account?{" "}
        <button type="button" onClick={() => void signOut()} className="font-medium text-accent hover:underline">
          Sign out
        </button>
      </AuthSwitch>
    </>
  );
}
