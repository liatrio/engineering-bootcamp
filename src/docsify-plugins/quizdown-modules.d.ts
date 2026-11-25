type QuizdownExtension = {};

interface QuizdownConfig {
  locale?: string;
  shuffleAnswers?: boolean;
  primaryColor?: string;
}

declare module 'quizdown' {
  const quizdown: {
    register(extension: QuizdownExtension): typeof quizdown;
    createApp(rawQuizdown: string, node: Element, config: QuizdownConfig): unknown;
    init(config?: QuizdownConfig & { startOnLoad?: boolean }): void;
  };
  export default quizdown;
}

declare module 'quizdown/public/build/extensions/quizdownHighlight.js' {
  const extension: QuizdownExtension;
  export default extension;
}

declare module 'quizdown/public/build/extensions/quizdownKatex.js' {
  const extension: QuizdownExtension;
  export default extension;
}
