import { Compiler, dom, get, marked, prism, slugify, util, version } from 'docsify';

// The ESM build skips the global API the CDN build set up (initGlobalAPI). The
// search plugin reads window.Docsify, and the prism-*.js language files read
// window.Prism. Must load before the plugin imports in third-party.ts.
Object.assign(window, {
  Docsify: { util, dom, get, slugify, version },
  DocsifyCompiler: Compiler,
  marked,
  Prism: prism,
});
