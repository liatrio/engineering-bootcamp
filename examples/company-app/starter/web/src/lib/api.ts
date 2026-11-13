/**
 * The one API client. Every request to a backend service goes through api().
 *
 * - Paths are relative (`/api/...`). In the browser they go to the same origin, which is the
 *   frontend-proxy in compose and the Vite dev-server proxy in development.
 * - Every service fails with RFC 9457 Problem Details, so any non-2xx becomes an ApiError
 *   that components can render without parsing anything.
 * - A request that never gets a response (service down, network error) becomes an ApiError
 *   with status 0, so callers handle one error type.
 */

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  readonly status: number;
  readonly title: string;
  readonly detail?: string;
  readonly type?: string;
  readonly errors: Record<string, string[]>;
  /** True when the body was Problem Details, i.e. a service (not the proxy) answered. */
  readonly isProblem: boolean;

  constructor(status: number, problem: ProblemDetails, isProblem: boolean) {
    const title = problem.title ?? (status === 0 ? 'Network error' : `HTTP ${status}`);
    super(problem.detail ?? title);
    this.name = 'ApiError';
    this.status = status;
    this.title = title;
    this.detail = problem.detail;
    this.type = problem.type;
    this.errors = problem.errors ?? {};
    this.isProblem = isProblem;
  }

  /** Messages for one form field. Matches keys like `email`, `Email`, or `$.email`. */
  fieldErrors(field: string): string[] {
    const wanted = field.toLowerCase();
    return Object.entries(this.errors)
      .filter(([key]) => normalizeKey(key) === wanted)
      .flatMap(([, messages]) => messages);
  }
}

/** `$.email`, `body.email`, `Email` → `email`, so .NET and FastAPI keys match form fields. */
export function normalizeKey(key: string): string {
  return key
    .replace(/^\$\./, '')
    .replace(/^body\./, '')
    .toLowerCase();
}

let baseUrl = '';

/** Point the client at an absolute origin. Only Pact tests need this; the app uses ''. */
export function setApiBaseUrl(url: string): void {
  baseUrl = url.replace(/\/$/, '');
}

function resolve(path: string): string {
  if (baseUrl) return `${baseUrl}${path}`;
  // Same as a relative URL in the browser; also lets jsdom-based tests resolve it.
  return typeof window === 'undefined' ? path : new URL(path, window.location.origin).toString();
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(resolve(path), {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
    });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    throw new ApiError(0, { title: 'Network error', detail: message }, false);
  }

  if (!response.ok) {
    const contentType = response.headers.get('content-type') ?? '';
    const isProblem = contentType.includes('json');
    const problem: ProblemDetails = isProblem
      ? await response.json().catch(() => ({}))
      : { title: response.statusText || undefined };
    throw new ApiError(response.status, problem, isProblem);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const jsonBody = (value: unknown): RequestInit['body'] => JSON.stringify(value);
