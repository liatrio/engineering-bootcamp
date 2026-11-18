import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { ProxyOptions } from 'vite';

const badGatewayOnError: ProxyOptions['configure'] = (proxy) => {
  proxy.on('error', (_error, _req, res) => {
    if ('writeHead' in res && !res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'text/plain' });
      res.end('Bad Gateway: is docker compose running?');
    }
  });
};

// The dev server proxies /api and /otlp to the compose frontend-proxy, so the
// browser only ever talks to one origin, exactly as it does in production.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.API_PROXY_TARGET ?? 'http://localhost:8080';
  // When the target is down, answer 502 like the real proxy does, so the UI's
  // "service isn't running" states behave the same in dev.
  const proxy = { target, changeOrigin: true, configure: badGatewayOnError };

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': proxy,
        '/otlp': proxy,
      },
    },
    test: {
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            environment: 'jsdom',
            globals: true,
            setupFiles: ['./src/test/setup.ts'],
            include: ['src/**/*.test.{ts,tsx}'],
            exclude: ['src/**/*.pact.test.ts'],
          },
        },
        {
          extends: true,
          test: {
            name: 'pact',
            environment: 'node',
            globals: true,
            include: ['src/**/*.pact.test.ts'],
            globalSetup: ['./src/test/pact-global-setup.ts'],
            testTimeout: 30_000,
          },
        },
      ],
    },
  };
});
