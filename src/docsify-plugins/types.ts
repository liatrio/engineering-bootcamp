/** Docsify plugin hook registration, limited to the hooks this site uses. */
export interface DocsifyHook {
  beforeEach(
    callback: (markdown: string, next: (markdown: string) => void) => void | Promise<void>,
  ): void;
  afterEach(callback: (html: string) => string): void;
  doneEach(callback: () => void): void;
}

export type DocsifyPlugin = (hook: DocsifyHook, vm: unknown) => void;

/** The `window.$docsify` options this site sets. */
export interface DocsifyConfig {
  name?: string;
  repo?: string;
  loadSidebar?: boolean;
  collapsibleSidebarGroups?: boolean;
  basePath?: string;
  maxLevel?: number;
  auto2top?: boolean;
  search?: string;
  pagination?: { previousText?: string; nextText?: string; crossChapter?: boolean };
  alias?: Record<string, string>;
  plugins?: DocsifyPlugin[];
}

declare global {
  interface Window {
    $docsify?: DocsifyConfig;
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
