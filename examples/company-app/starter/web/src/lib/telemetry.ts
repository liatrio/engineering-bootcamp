/**
 * Browser tracing. Called once from main.tsx before React renders.
 *
 * Every fetch to /api/* gets a client span and a W3C `traceparent` header, so a trace starts
 * in the browser and continues through the frontend-proxy into each service. Spans are sent
 * to /otlp/v1/traces on the same origin; the proxy forwards them to otel-lgtm (no CORS).
 *
 * Note: @opentelemetry/sdk-trace-web was folded into @opentelemetry/sdk-trace in the 3.x line,
 * so the web TracerProvider comes from there.
 */
import { context, propagation, trace } from '@opentelemetry/api';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchSpanProcessor, StackContextManager, TracerProvider } from '@opentelemetry/sdk-trace';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

let started = false;

export function initTelemetry(): void {
  if (started) return;
  started = true;

  const origin = window.location.origin;
  const provider = new TracerProvider({
    resource: resourceFromAttributes({ [ATTR_SERVICE_NAME]: 'web' }),
    spanProcessors: [
      new BatchSpanProcessor({
        exporter: new OTLPTraceExporter({ url: `${origin}/otlp/v1/traces` }),
      }),
    ],
  });

  trace.setGlobalTracerProvider(provider);
  propagation.setGlobalPropagator(new W3CTraceContextPropagator());
  // Without a context manager, the fetch span never becomes the "active" context, so there
  // is nothing to inject and no traceparent header goes out. The stack-based manager is
  // enough for fetch spans (no zone.js needed).
  context.setGlobalContextManager(new StackContextManager().enable());

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      new FetchInstrumentation({
        // Only trace calls to our APIs; never trace the exporter's own requests.
        ignoreUrls: [new RegExp(`^${escapeRegExp(origin)}/(?!api/)`)],
        // Same-origin requests get traceparent automatically; listed for clarity.
        propagateTraceHeaderCorsUrls: [new RegExp(`^${escapeRegExp(origin)}/api/`)],
      }),
    ],
  });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
