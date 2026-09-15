"use client";

import { useCallback, useState, type ChangeEvent } from "react";

type Errors<T> = Partial<Record<keyof T, string>>;

/** Controlled form values + per-field errors, cleared as the user edits. */
export function useForm<T extends Record<string, string | boolean>>(initial: T) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Errors<T>>({});

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }, []);

  /** Spread onto an input: value/checked + onChange. */
  const bind = useCallback(
    <K extends keyof T>(field: K) => {
      const current = values[field];
      const onChange = (event: ChangeEvent<HTMLInputElement>) =>
        setValue(field, (typeof current === "boolean" ? event.target.checked : event.target.value) as T[K]);
      return typeof current === "boolean"
        ? { checked: current, onChange, error: errors[field] }
        : { value: current as string, onChange, error: errors[field] };
    },
    [values, errors, setValue],
  );

  /** Runs validators; returns true when every field passes. */
  const validate = useCallback(
    (rules: { [K in keyof T]?: (value: T[K], all: T) => string | undefined }) => {
      const next: Errors<T> = {};
      for (const field of Object.keys(rules) as (keyof T)[]) {
        const message = rules[field]?.(values[field], values);
        if (message) next[field] = message;
      }
      setErrors(next);
      return Object.keys(next).length === 0;
    },
    [values],
  );

  return { values, errors, setErrors, setValue, bind, validate };
}
