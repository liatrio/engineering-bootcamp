import { registerPlugin, type DocsifyHook } from './types';

// Docsify renders `> [!NOTE]` as `<div class="callout note">` and drops the
// marker, so add the type's name as text, like GitHub's alert title.
// css/common.css styles `.callout-title` and its icon.
const callouts = (hook: DocsifyHook) => {
  hook.afterEach((html) =>
    html.replace(/<div class="callout (\w+)">/g, (tag, type: string) => {
      const title = type[0].toUpperCase() + type.slice(1);
      return `${tag}<p class="callout-title">${title}</p>`;
    }),
  );
};

registerPlugin(callouts);
