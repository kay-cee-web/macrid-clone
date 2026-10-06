"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { PasswordField, TextField } from "@/components/ui/TextField";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "@/hooks/useForm";
import { reportFormError } from "@/lib/api/form-errors";
import { email, required } from "@/lib/validation";
import { login } from "@/services/auth";
import { AuthCard, AuthSwitch } from "./AuthCard";
import { SocialAuth } from "./SocialAuth";

export function LoginForm() {
  const { signIn } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm({ email: "", password: "", remember: true });

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const valid = form.validate({ email, password: required("Enter your password.") });
    if (!valid) return;

    setSubmitting(true);
    try {
      const token = await login({ email: form.values.email.trim(), password: form.values.password });
      await signIn(token, { remember: form.values.remember });
    } catch (err) {
      reportFormError(err, { fallback: "Could not sign in", setErrors: form.setErrors });
      setSubmitting(false);
    }
  }

  return (
    <>
      <AuthCard icon={Lock} title="Welcome back" description="Sign in to see what your agents have been doing.">
        <SocialAuth />
        <form noValidate onSubmit={onSubmit} className="grid gap-4">
          <TextField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            {...form.bind("email")}
          />
          <PasswordField
            id="password"
            label="Password"
            autoComplete="current-password"
            placeholder="••••••••"
            aside={
              <Link href="/forgot-password" className="text-xs font-medium text-accent hover:underline">
                Forgot password?
              </Link>
            }
            {...form.bind("password")}
          />
          <Checkbox id="remember" label="Remember me on this device" {...form.bind("remember")} />
          <Button type="submit" variant="cta" size="lg" block loading={submitting} className="mt-2 h-12">
            Sign in
          </Button>
        </form>
      </AuthCard>
      <AuthSwitch>
        Don&apos;t have an account? <Link href="/register">Create one for free</Link>
      </AuthSwitch>
    </>
  );
}
