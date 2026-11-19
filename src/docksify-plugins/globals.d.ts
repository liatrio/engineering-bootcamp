// Globals provided by the CDN scripts in index.html, typed to what the bundle calls.

interface QuizdownExtension {}

interface QuizdownConfig {
  locale?: string;
  shuffleAnswers?: boolean;
  primaryColor?: string;
}

interface Quizdown {
  register(extension: QuizdownExtension): Quizdown;
  createApp(rawQuizdown: string, node: Element, config: QuizdownConfig): unknown;
  init(config?: QuizdownConfig & { startOnLoad?: boolean }): void;
}

declare const quizdown: Quizdown;
declare const quizdownHighlight: QuizdownExtension;
declare const quizdownKatex: QuizdownExtension;

declare const EditOnGithubPlugin: {
  create(sourceUrl: string): import('./types').DocsifyPlugin;
};
