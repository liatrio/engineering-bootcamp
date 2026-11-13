export interface Notification {
  id: string;
  /** The event type, e.g. `employee.created` */
  type: string;
  message: string;
  occurredAt: string;
  /** Hex trace ID of the request that caused the event, or '' */
  traceId: string;
}
