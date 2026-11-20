import quizdown from 'quizdown';
import quizdownHighlight from 'quizdown/public/build/extensions/quizdownHighlight.js';
import quizdownKatex from 'quizdown/public/build/extensions/quizdownKatex.js';

// startOnLoad: false because init() would otherwise render every `.quizdown`
// div on window load, racing the loader in quizdown.ts.
quizdown.register(quizdownHighlight).register(quizdownKatex).init({ startOnLoad: false });

export default quizdown;
