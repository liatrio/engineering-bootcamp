import 'docsify-edit-on-github';
import type { DocsifyConfig } from './types';

// Must be the first import in src/index.ts so registerPlugin() in the other
// modules, and the third-party plugins in ./third-party.ts (which prepend
// themselves to window.$docsify.plugins as an import side effect and throw
// if window.$docsify is missing), find the config set here.
const config: DocsifyConfig = {
  name: "Liatrio's Engineering Bootcamp",
  repo: 'liatrio/engineering-bootcamp',
  loadSidebar: true,
  basePath: '/docs/',
  maxLevel: 0,
  auto2top: true,
  search: 'auto',
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

window.$docsify = config;
