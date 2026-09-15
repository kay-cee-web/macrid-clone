"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PasswordField, TextField } from "@/components/ui/TextField";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "@/hooks/useForm";
import { reportFormError } from "@/lib/api/form-errors";
import { email, required } from "@/lib/validation";
import { login } from "@/services/auth";
import { AuthHeading, AuthSwitch } from "./AuthHeading";

export function LoginForm() {
  const { signIn } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm({ email: "", password: "" });

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const valid = form.validate({ email, password: required("Enter your password.") });
    if (!valid) return;

    setSubmitting(true);
    try {
      const token = await login({ email: form.values.email.trim(), password: form.values.password });
      await signIn(token);
    } catch (err) {
      reportFormError(err, { fallback: "Could not sign in", setErrors: form.setErrors });
      setSubmitting(false);
    }
  }

  return (
    <>
      <AuthHeading title="Welcome back" description="Sign in to see what your agents have been doing." />
      <form noValidate onSubmit={onSubmit} className="grid gap-4">
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          leading={<Mail />}
          {...form.bind("email")}
        />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          leading={<Lock />}
          aside={
            <Link href="/forgot-password" className="text-[12.5px] font-medium text-accent hover:underline">
              Forgot password?
            </Link>
          }
          {...form.bind("password")}
        />
        <Button type="submit" size="lg" block loading={submitting} className="mt-2">
          Sign in
        </Button>
      </form>
      <AuthSwitch>
        New to Macrid? <Link href="/register">Create an account</Link>
      </AuthSwitch>
    </>
  );
}
