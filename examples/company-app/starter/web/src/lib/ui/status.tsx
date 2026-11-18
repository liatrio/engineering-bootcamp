import type { ReactNode } from 'react';
import { ApiError } from '../api';

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <p className="muted" role="status">
      {label}
    </p>
  );
}

export function ErrorMessage({ error }: { error: unknown }) {
  const text =
    error instanceof ApiError
      ? `${error.title}${error.detail && error.detail !== error.title ? `: ${error.detail}` : ''}`
      : 'Something went wrong.';
  return (
    <div className="alert alert-error" role="alert">
      {text}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>;
}
