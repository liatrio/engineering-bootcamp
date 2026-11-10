// markdownlint custom rule: every line of a blockquote starts with `>`.
//
// A line without `>` right after a blockquote line is "lazy continuation":
// CommonMark keeps it in the blockquote's paragraph. So a step such as
// `2. Create a pipeline` written straight after a callout renders inside the
// callout box. Start the line with `>` if it belongs to the blockquote, or put a
// blank line before it if it does not.
//
// micromark reads some lazy lines, such as a list item numbered 2 or later, as a
// new block, which CommonMark, marked and GitHub do not. So the rule also flags
// the line right after the blockquote unless it is blank.
//
// Loaded via `customRules` in .markdownlint-cli2.jsonc.

// Outermost blockquotes only: a nested one shares its lines, so checking it too
// would report each lazy line twice.
function* blockQuotes(tokens) {
    for (const token of tokens) {
        if (token.type === 'blockQuote') yield token;
        else if (token.children) yield* blockQuotes(token.children);
    }
}

/** @type {import("markdownlint").Rule} */
module.exports = {
    names: ['no-lazy-blockquote-lines'],
    description: 'Every line of a blockquote starts with `>`',
    information: new URL('https://github.com/liatrio/engineering-bootcamp/blob/master/STYLE.md#callouts'),
    tags: ['blockquote'],
    parser: 'micromark',
    function: (params, onError) => {
        for (const quote of blockQuotes(params.parsers.micromark.tokens)) {
            const last = Math.min(quote.endLine + 1, params.lines.length);
            for (let lineNumber = quote.startLine; lineNumber <= last; lineNumber++) {
                const line = params.lines[lineNumber - 1];
                if (!line.trim() || line.trimStart().startsWith('>')) continue;
                onError({
                    lineNumber,
                    detail: 'This line continues the blockquote above it; start it with `>`, or put a blank line before it',
                    context: line.trim(),
                });
            }
        }
    },
};
