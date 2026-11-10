// markdownlint custom rule: callouts use one of the five GitHub alert types.
//
// Docsify turns any blockquote whose first paragraph starts with `[!WORD]` into a
// callout, but css/common.css only styles NOTE, TIP, IMPORTANT, WARNING and
// CAUTION, so `[!INFO]` would look like a NOTE titled "Info". GitHub renders an
// unknown word as a plain blockquote with the marker still showing.
//
// Loaded via `customRules` in .markdownlint-cli2.jsonc.

const TYPES = ['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION'];

function* blockQuotes(tokens) {
    for (const token of tokens) {
        if (token.type === 'blockQuote') yield token;
        if (token.children) yield* blockQuotes(token.children);
    }
}

/** @type {import("markdownlint").Rule} */
module.exports = {
    names: ['callout-types'],
    description: 'Callouts use one of the five GitHub alert types',
    information: new URL('https://github.com/liatrio/engineering-bootcamp/blob/master/STYLE.md#callouts'),
    tags: ['docsify'],
    parser: 'micromark',
    function: (params, onError) => {
        for (const quote of blockQuotes(params.parsers.micromark.tokens)) {
            // Docsify reads the marker from the blockquote's first paragraph, which
            // micromark wraps in a `content` token.
            const paragraph = quote.children
                .flatMap((token) => (token.type === 'content' ? token.children : [token]))
                .find((token) => token.type === 'paragraph');
            const marker = paragraph && /^\[!(\w+)\]/.exec(paragraph.text);
            if (!marker || TYPES.includes(marker[1])) continue;
            onError({
                lineNumber: paragraph.startLine,
                detail: `\`${marker[0]}\` is not an alert type; use ${TYPES.map((type) => `\`[!${type}]\``).join(', ')}`,
                context: params.lines[paragraph.startLine - 1].trim(),
            });
        }
    },
};
