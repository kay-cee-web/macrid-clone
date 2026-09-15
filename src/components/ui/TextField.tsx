"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Field, describedBy } from "./Field";
import { Input } from "./Input";
import { IconButton } from "./IconButton";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  aside?: ReactNode;
  leading?: ReactNode;
};

export function TextField({ id, label, error, hint, aside, leading, ...rest }: TextFieldProps) {
  return (
    <Field id={id} label={label} error={error} hint={hint} aside={aside}>
      <Input
        id={id}
        name={rest.name ?? id}
        invalid={Boolean(error)}
        leading={leading}
        aria-describedby={describedBy(id, error, hint)}
        {...rest}
      />
    </Field>
  );
}

/** A TextField with a show/hide toggle. */
export function PasswordField({ id, label, error, hint, aside, leading, ...rest }: TextFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <Field id={id} label={label} error={error} hint={hint} aside={aside}>
      <Input
        id={id}
        name={rest.name ?? id}
        type={visible ? "text" : "password"}
        invalid={Boolean(error)}
        leading={leading}
        aria-describedby={describedBy(id, error, hint)}
        trailing={
          <IconButton
            size="sm"
            label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOff /> : <Eye />}
          </IconButton>
        }
        {...rest}
      />
    </Field>
  );
}
