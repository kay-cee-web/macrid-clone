"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { PasswordField, TextField } from "@/components/ui/TextField";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "@/hooks/useForm";
import { reportFormError } from "@/lib/api/form-errors";
import { dexisphereSiteLink } from "@/lib/config";
import { email, minLength, password, required } from "@/lib/validation";
import { register } from "@/services/auth";
import { AuthCard, AuthSwitch } from "./AuthCard";
import { PasswordStrength } from "./PasswordStrength";
import { SocialAuth } from "./SocialAuth";

const INITIAL = { name: "", email: "", licence: "", password: "", accept: false };
type FieldName = keyof typeof INITIAL;

const LEGAL_LINK = "font-medium text-accent hover:underline";

export function RegisterForm() {
  const { signIn } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm(INITIAL);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const valid = form.validate({
      name: (v) => required("Enter your name.")(v) ?? minLength(2, "Use at least 2 characters.")(v),
      email,
      licence: required("Enter your licence code."),
      password,
      accept: required("Accept the terms and privacy policy to continue."),
    });
    if (!valid) return;

    setSubmitting(true);
    try {
      const { values } = form;
      // One password field, as on Tapotik; the show toggle stands in for typing it twice.
      const token = await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        password_confirmation: values.password,
        licensecode: values.licence.trim(),
      });
      toast.success("Account created. Check your inbox for a 6-digit code.");
      await signIn(token);
    } catch (err) {
      reportFormError<FieldName>(err, {
        fallback: "Could not create your account",
        setErrors: form.setErrors,
        fields: { licensecode: "licence", password_confirmation: "password" },
      });
      setSubmitting(false);
    }
  }

  return (
    <>
      <AuthCard icon={Sparkles} title="Create your account" description="Use the licence code from your plan.">
        <SocialAuth />
        <form noValidate onSubmit={onSubmit} className="grid gap-4">
          <TextField id="name" label="Full name" autoComplete="name" placeholder="Alex Kim" {...form.bind("name")} />
          <TextField
            id="email"
            label="Work email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            {...form.bind("email")}
          />
          <PasswordField
            id="password"
            label="Password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            {...form.bind("password")}
          />
          <PasswordStrength value={form.values.password} />
          <TextField
            id="licence"
            label="Licence code"
            placeholder="From your plan purchase"
            autoComplete="off"
            className="font-mono"
            {...form.bind("licence")}
          />
          <Checkbox
            id="accept"
            label={
              <>
                I agree to the{" "}
                <a href={dexisphereSiteLink("/terms")} target="_blank" rel="noreferrer" className={LEGAL_LINK}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href={dexisphereSiteLink("/privacy")} target="_blank" rel="noreferrer" className={LEGAL_LINK}>
                  Privacy Policy
                </a>
              </>
            }
            {...form.bind("accept")}
          />
          <Button type="submit" variant="cta" size="lg" block loading={submitting} className="h-12">
            Create account
          </Button>
        </form>
      </AuthCard>
      <AuthSwitch>
        Already have an account? <Link href="/login">Sign in</Link>
      </AuthSwitch>
    </>
  );
}
