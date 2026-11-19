import { registerPlugin, type DocsifyHook } from './types';

const config = {
  locale: 'en',
  shuffleAnswers: false,
  primaryColor: '#24ae1dff',
};

// Each `<div class="quizdown">` wraps a `<div id="<path under src/quizzes/>">`.
// Quiz files are served as-is by Docsify and imported by the browser at runtime,
// so adding a quiz needs no rebuild. webpackIgnore keeps webpack from bundling
// the import; the URL is built from the page because a native import() resolves
// relative to dist/main.js.
//
// quizdown, katex and highlight.js are large, so they load as a separate chunk
// the first time a page has a quiz.
const quizzes = (hook: DocsifyHook) => {
  hook.doneEach(() => {
    const nodes = document.getElementsByClassName('quizdown');
    if (nodes.length === 0) {
      return;
    }
    const runtime = import('./quizdown-runtime');
    for (const node of nodes) {
      const url = new URL(`src/quizzes/${node.firstElementChild!.id}`, document.baseURI).href;
      Promise.all([runtime, import(/* webpackIgnore: true */ url)])
        .then(([{ default: quizdown }, module]: [typeof import('./quizdown-runtime'), { rawQuizdown: string }]) => {
          quizdown.createApp(module.rawQuizdown, node, config);
        })
        .catch((error) => {
          console.error(
            "Error importing quiz, make sure the file name matches the quizdown inner div's id: ",
            error,
          );
        });
    }
  });
};

registerPlugin(quizzes);
