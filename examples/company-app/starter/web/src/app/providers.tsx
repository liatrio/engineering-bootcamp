import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ApiError } from '../lib/api';

// Retrying a 4xx never helps, and a 502 means the proxy has no upstream (for example the
// assignments-service before Chapter 3.3). Retry anything else once.
function isRetryable(error: unknown): boolean {
  if (!(error instanceof ApiError)) return true;
  return !(error.status >= 400 && error.status < 500) && error.status !== 502;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10_000,
        retry: (failureCount, error) => failureCount < 1 && isRetryable(error),
      },
    },
  });
}

export function AppProviders({ client, children }: { client: QueryClient; children: ReactNode }) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
