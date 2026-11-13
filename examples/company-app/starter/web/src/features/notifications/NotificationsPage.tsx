import { EmptyState, ErrorMessage, Loading } from '../../lib/ui/status';
import { POLL_INTERVAL_MS, useNotifications } from './api';

const formatTime = (iso: string) => new Date(iso).toLocaleString();

export function NotificationsPage() {
  const notifications = useNotifications();

  return (
    <section aria-labelledby="notifications-heading">
      <header className="page-header">
        <h1 id="notifications-heading">Notifications</h1>
        <p className="muted">Refreshes every {POLL_INTERVAL_MS / 1000} seconds.</p>
      </header>

      {notifications.isPending && <Loading />}
      {notifications.isError && <ErrorMessage error={notifications.error} />}
      {notifications.isSuccess && notifications.data.length === 0 && (
        <EmptyState>
          Nothing yet. Create or change an employee and an event shows up here.
        </EmptyState>
      )}
      {notifications.isSuccess && notifications.data.length > 0 && (
        <ol className="feed" aria-live="polite">
          {notifications.data.map((n) => (
            <li key={n.id}>
              <span className="badge">{n.type}</span>
              <span className="feed-message">{n.message}</span>
              <time dateTime={n.occurredAt} className="muted">
                {formatTime(n.occurredAt)}
              </time>
              {n.traceId && (
                <code className="trace" title="Trace ID: search for it in Grafana Tempo">
                  {n.traceId}
                </code>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
