import type { DocsifyConfig } from './types';

// Must be the first import in src/index.ts so registerPlugin() in the other
// modules prepends to the `plugins` array set here. The CDN plugins (search,
// pagination, ...) load before the bundle and add themselves to an existing
// `window.$docsify`, so merge into it instead of replacing it.
const config: DocsifyConfig = {
  name: "Liatrio's Engineering Bootcamp",
  repo: 'liatrio/engineering-bootcamp',
  loadSidebar: true,
  basePath: '/docs/',
  maxLevel: 0,
  auto2top: true,
  search: 'auto', // default
  pagination: {
    previousText: 'Previous Page',
    nextText: 'Next Page',
    crossChapter: true,
  },
  alias: {
    '/.*/_sidebar.md': '/_sidebar.md',
  },
  plugins: [
    // "/blob/" lets the plugin swap in "/edit/" so the link opens GitHub's editor
    EditOnGithubPlugin.create('https://github.com/liatrio/engineering-bootcamp/blob/master/docs/'),
  ],
};

const existing = window.$docsify ?? {};
window.$docsify = { ...config, plugins: [...(existing.plugins ?? []), ...(config.plugins ?? [])] };
