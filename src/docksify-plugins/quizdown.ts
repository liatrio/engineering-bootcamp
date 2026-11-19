import { registerPlugin, type DocsifyHook } from './types';

quizdown.register(quizdownHighlight).register(quizdownKatex).init();

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
const quizzes = (hook: DocsifyHook) => {
  hook.doneEach(() => {
    for (const node of document.getElementsByClassName('quizdown')) {
      const url = new URL(`src/quizzes/${node.firstElementChild!.id}`, document.baseURI).href;
      import(/* webpackIgnore: true */ url)
        .then((module: { rawQuizdown: string }) => {
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
