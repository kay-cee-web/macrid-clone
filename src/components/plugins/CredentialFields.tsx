"use client";

import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { PasswordField, TextField } from "@/components/ui/TextField";
import type { ConnectorField } from "@/types/connector";

type CredentialFieldsProps = {
  /** Prefixes each input's id, so two forms on a page never collide. */
  idPrefix: string;
  fields: ConnectorField[];
  values: Record<string, string>;
  errors: Record<string, string>;
  onChange: (name: string, value: string) => void;
};

/** Starting values: a select's first option, otherwise blank. */
export const initialValues = (fields: ConnectorField[]) =>
  Object.fromEntries(fields.map((f) => [f.name, f.options?.[0]?.value ?? ""]));

/** An error per required field left blank; empty when the form can go. */
export const missingFields = (fields: ConnectorField[], values: Record<string, string>) =>
  Object.fromEntries(
    fields.filter((f) => f.required && !values[f.name]?.trim()).map((f) => [f.name, `Enter the ${f.label.toLowerCase()}.`]),
  );

/** A credential form's inputs, drawn from a field list (a connector's own, or one the backend sent). */
export function CredentialFields({ idPrefix, fields, values, errors, onChange }: CredentialFieldsProps) {
  return fields.map((field) => {
    const id = `${idPrefix}-${field.name}`;
    const common = { id, label: field.label, error: errors[field.name], hint: field.help };
    if (field.type === "select") {
      return (
        <Field key={field.name} {...common}>
          <Select id={id} value={values[field.name] ?? ""} onChange={(e) => onChange(field.name, e.target.value)}>
            {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
      );
    }
    const Input = field.type === "password" ? PasswordField : TextField;
    return (
      <Input
        key={field.name}
        {...common}
        type={field.type === "password" ? undefined : field.type}
        placeholder={field.placeholder}
        autoComplete="off"
        value={values[field.name] ?? ""}
        onChange={(e) => onChange(field.name, e.target.value)}
      />
    );
  });
}
