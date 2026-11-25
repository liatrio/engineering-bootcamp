// Defined on window by the edit-on-github import in config.ts.
declare const EditOnGithubPlugin: {
  create(sourceUrl: string): import('./types').DocsifyPlugin;
};

// Stylesheets imported for their emitted file only; see webpack.common.js.
declare module 'docsify/dist/themes/*.css';
declare module 'docsify/dist/themes/addons/*.css';
