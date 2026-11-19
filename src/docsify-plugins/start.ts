import { Docsify } from 'docsify';

// The ESM build does not auto-mount (the CDN docsify.min.js did). Read
// window.$docsify once all plugins have registered.
function start(): void {
  new Docsify();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
