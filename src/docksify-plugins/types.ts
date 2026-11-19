/** Docsify plugin hook registration, limited to the hooks this site uses. */
export interface DocsifyHook {
  beforeEach(
    callback: (markdown: string, next: (markdown: string) => void) => void | Promise<void>,
  ): void;
  doneEach(callback: () => void): void;
}

export type DocsifyPlugin = (hook: DocsifyHook, vm: unknown) => void;

declare global {
  interface Window {
    $docsify?: { plugins?: DocsifyPlugin[] };
  }
}

export interface Exercise {
  estMinutes?: number;
  technologies?: string[];
}

/** Front-matter of one section, as aggregated in docs/README.md. */
export interface SectionMetadata {
  category?: string;
  estReadingMinutes?: number;
  exercises?: Exercise[];
}

export type BootcampMetadata = Record<string, SectionMetadata>;

/** Registers a plugin on the page's global docsify config. */
export function registerPlugin(plugin: DocsifyPlugin): void {
  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [plugin].concat(window.$docsify.plugins || []);
}
