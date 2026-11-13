import { useId, type ComponentProps, type ReactNode } from 'react';
import type { FieldError } from 'react-hook-form';
import { ApiError, normalizeKey } from '../api';

interface FieldShellProps {
  label: string;
  error?: FieldError;
  hint?: string;
  children: (a11y: {
    id: string;
    'aria-invalid': boolean;
    'aria-describedby'?: string;
  }) => ReactNode;
}

/** Label, control, and error message wired together for screen readers. */
function FieldShell({ label, error, hint, children }: FieldShellProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ');
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': describedBy || undefined,
      })}
      {hint && (
        <small id={hintId} className="hint">
          {hint}
        </small>
      )}
      {error?.message && (
        <p id={errorId} className="field-error" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}

type Base = { label: string; error?: FieldError; hint?: string };

export function TextField({ label, error, hint, ...rest }: Base & ComponentProps<'input'>) {
  return (
    <FieldShell label={label} error={error} hint={hint}>
      {(a11y) => <input {...rest} {...a11y} />}
    </FieldShell>
  );
}

export function TextAreaField({ label, error, hint, ...rest }: Base & ComponentProps<'textarea'>) {
  return (
    <FieldShell label={label} error={error} hint={hint}>
      {(a11y) => <textarea rows={3} {...rest} {...a11y} />}
    </FieldShell>
  );
}

export function SelectField({
  label,
  error,
  hint,
  children,
  ...rest
}: Base & ComponentProps<'select'>) {
  return (
    <FieldShell label={label} error={error} hint={hint}>
      {(a11y) => (
        <select {...rest} {...a11y}>
          {children}
        </select>
      )}
    </FieldShell>
  );
}

/**
 * Form-level error: a 409, a 500, or anything that isn't tied to one field. For a 400 whose
 * field errors were shown next to the inputs, it only says so, plus any messages for fields
 * the form doesn't have.
 */
export function FormError({ error, fields = [] }: { error: unknown; fields?: readonly string[] }) {
  if (!error) return null;
  let messages: string[];
  if (error instanceof ApiError && error.status === 400 && Object.keys(error.errors).length > 0) {
    const known = new Set(fields.map((f) => f.toLowerCase()));
    const unmatched = Object.entries(error.errors)
      .filter(([key]) => !known.has(normalizeKey(key)))
      .flatMap(([, msgs]) => msgs);
    messages = ['Please fix the highlighted fields.', ...unmatched];
  } else if (error instanceof ApiError) {
    messages = [error.detail ?? error.title];
  } else {
    messages = [error instanceof Error ? error.message : 'Something went wrong.'];
  }
  return (
    <div className="alert alert-error" role="alert">
      {messages.map((m) => (
        <p key={m}>{m}</p>
      ))}
    </div>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button type="submit" className="btn btn-primary" disabled={pending} aria-busy={pending}>
      {pending ? 'Saving…' : children}
    </button>
  );
}
