import { toast } from "sonner";
import { mapFieldErrors } from "@/lib/validation";
import { extractApiError, fieldErrors } from "./errors";

/**
 * Show a failed submit: validation messages go under their fields, and
 * anything else becomes a toast.
 */
export function reportFormError<T extends string>(
  err: unknown,
  options: {
    fallback: string;
    setErrors: (errors: Partial<Record<T, string>>) => void;
    /** Backend key → form field, e.g. { password_confirmation: "confirm" }. */
    fields?: Partial<Record<string, T>>;
  },
) {
  const mapped = mapFieldErrors<T>(fieldErrors(err), options.fields ?? {});
  if (Object.keys(mapped).length > 0) options.setErrors(mapped);
  toast.error(extractApiError(err, options.fallback));
}
