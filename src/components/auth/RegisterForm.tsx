"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { PasswordField, TextField } from "@/components/ui/TextField";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "@/hooks/useForm";
import { reportFormError } from "@/lib/api/form-errors";
import { email, minLength, password, required } from "@/lib/validation";
import { register } from "@/services/auth";
import { AuthHeading, AuthSwitch } from "./AuthHeading";

const INITIAL = { name: "", email: "", licence: "", password: "", confirm: "", accept: false };
type FieldName = keyof typeof INITIAL;

export function RegisterForm() {
  const { signIn } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm(INITIAL);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const valid = form.validate({
      name: (v) => required("Enter your name.")(v) ?? minLength(2, "Use at least 2 characters.")(v),
      email,
      password,
      confirm: (v, all) => (!v ? "Confirm your password." : v !== all.password ? "Passwords don't match." : undefined),
      accept: required("Accept the privacy policy to continue."),
    });
    if (!valid) return;

    setSubmitting(true);
    try {
      const { values } = form;
      const token = await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        password_confirmation: values.confirm,
        licensecode: values.licence.trim(),
      });
      toast.success("Account created. Check your inbox for a 6-digit code.");
      await signIn(token);
    } catch (err) {
      reportFormError<FieldName>(err, {
        fallback: "Could not create your account",
        setErrors: form.setErrors,
        fields: { licensecode: "licence", password_confirmation: "confirm" },
      });
      setSubmitting(false);
    }
  }

  return (
    <>
      <AuthHeading title="Create your account" description="Set up agents that run Macrid for you." />
      <form noValidate onSubmit={onSubmit} className="grid gap-4">
        <TextField id="name" label="Full name" autoComplete="name" {...form.bind("name")} />
        <TextField id="email" label="Work email" type="email" autoComplete="email" {...form.bind("email")} />
        <TextField
          id="licence"
          label="Licence code"
          hint="Optional. Only if you were given one."
          autoComplete="off"
          className="font-mono"
          {...form.bind("licence")}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <PasswordField id="password" label="Password" autoComplete="new-password" {...form.bind("password")} />
          <PasswordField id="confirm" label="Confirm" autoComplete="new-password" {...form.bind("confirm")} />
        </div>
        <Checkbox
          id="accept"
          label={
            <>
              I agree to the{" "}
              <a href="https://macrid.com/privacy-policy" target="_blank" rel="noreferrer" className="font-medium text-accent hover:underline">
                privacy policy
              </a>
              .
            </>
          }
          {...form.bind("accept")}
        />
        <Button type="submit" size="lg" block loading={submitting} className="mt-2">
          Create account
        </Button>
      </form>
      <AuthSwitch>
        Already have an account? <Link href="/login">Sign in</Link>
      </AuthSwitch>
    </>
  );
}
