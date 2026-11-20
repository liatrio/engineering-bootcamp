import matter from 'gray-matter';
import { registerPlugin, type BootcampMetadata, type DocsifyHook } from './types';

export async function fetchMetadata(): Promise<BootcampMetadata | null> {
  let bootcampMetadata: BootcampMetadata | null = null;
  try {
    const response = await fetch(window.location.origin + "/docs/README.md");
    const text = await response.text();
    bootcampMetadata = matter(text).data as BootcampMetadata;

  } catch (error) {
    console.log(error);
  } finally {
    return bootcampMetadata;
  }
}

const stripFrontMatter = (hook: DocsifyHook) => {
  hook.beforeEach((markdown, next) => {
    const { content } = matter(markdown);

    next(content);
  });
};

registerPlugin(stripFrontMatter);
