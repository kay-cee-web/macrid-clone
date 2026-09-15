"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthHeading, AuthSwitch } from "./AuthHeading";
import { ResetEmailStep, ResetCodeStep, ResetPasswordStep } from "./ResetSteps";

type Step = "email" | "code" | "password";

const COPY: Record<Step, { title: string; description: (email: string) => React.ReactNode }> = {
  email: {
    title: "Reset your password",
    description: () => "Enter your account email and we'll send you a 6-digit code.",
  },
  code: {
    title: "Enter the code",
    description: (email) => (
      <>
        We sent it to <span className="font-medium text-ink">{email}</span>.
      </>
    ),
  },
  password: {
    title: "Choose a new password",
    description: () => "Use at least 8 characters.",
  },
};

export function ForgotPasswordFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  return (
    <>
      <AuthHeading title={COPY[step].title} description={COPY[step].description(email)} />
      {step === "email" && (
        <ResetEmailStep
          onSent={(address) => {
            setEmail(address);
            setStep("code");
          }}
        />
      )}
      {step === "code" && (
        <ResetCodeStep
          email={email}
          onVerified={(value) => {
            setCode(value);
            setStep("password");
          }}
        />
      )}
      {step === "password" && (
        <ResetPasswordStep
          email={email}
          code={code}
          onDone={() => {
            toast.success("Password updated. Sign in with your new password.");
            router.replace("/login");
          }}
        />
      )}
      <AuthSwitch>
        Remembered it? <Link href="/login">Back to sign in</Link>
      </AuthSwitch>
    </>
  );
}
