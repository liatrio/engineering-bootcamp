import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './index.css';

// Start tracing before the first fetch, so every /api call is traced. Loaded as its own
// chunk; set VITE_OTEL_ENABLED=false to skip it entirely.
if (import.meta.env.VITE_OTEL_ENABLED !== 'false') {
  const { initTelemetry } = await import('./lib/telemetry');
  initTelemetry();
}

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
