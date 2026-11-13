import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { ApiError } from '../api';

/**
 * Copy Problem Details `errors` onto the matching form fields so the message shows next to
 * the input. Returns true if at least one field error was applied.
 */
export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  fields: readonly Path<T>[],
  setError: UseFormSetError<T>,
): boolean {
  if (!(error instanceof ApiError) || error.status !== 400) return false;
  let applied = false;
  for (const field of fields) {
    const messages = error.fieldErrors(field);
    if (messages.length > 0) {
      setError(field, { type: 'server', message: messages.join(' ') });
      applied = true;
    }
  }
  return applied;
}
