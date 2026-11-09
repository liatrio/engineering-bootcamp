// markdownlint custom rule: reject Docsify v4 callout shorthand (`?>` and `!>`).
//
// Docsify v5 deprecated the shorthand in favour of GitHub-style alerts
// (`> [!TIP]`, `> [!WARNING]`, ...), which css/common.css styles and GitHub also
// renders. Docsify treats a paragraph as a legacy callout when its text starts
// with the marker, so this rule checks paragraph starts the same way. Code
// fences and inline code are never paragraph starts, so they are not flagged.
//
// Loaded via `customRules` in .markdownlint-cli2.jsonc.

const REPLACEMENT = {
    '?>': '`> [!TIP]` (or `> [!NOTE]`)',
    '!>': '`> [!IMPORTANT]`, `> [!WARNING]`, or `> [!CAUTION]`',
};

function* paragraphs(tokens) {
    for (const token of tokens) {
        if (token.type === 'paragraph') yield token;
        if (token.children) yield* paragraphs(token.children);
    }
}

/** @type {import("markdownlint").Rule} */
module.exports = {
    names: ['no-legacy-callouts'],
    description: 'Callouts use GitHub-style alerts, not Docsify v4 `?>` / `!>`',
    information: new URL('https://github.com/liatrio/engineering-bootcamp/blob/master/STYLE.md#callouts'),
    tags: ['docsify'],
    parser: 'micromark',
    function: (params, onError) => {
        for (const paragraph of paragraphs(params.parsers.micromark.tokens)) {
            const marker = paragraph.text.slice(0, 2);
            if (!(marker in REPLACEMENT)) continue;
            onError({
                lineNumber: paragraph.startLine,
                detail: `Replace \`${marker}\` with ${REPLACEMENT[marker]} on its own line, then the text on \`> \` lines`,
                context: params.lines[paragraph.startLine - 1].trim(),
                range: [paragraph.startColumn, 2],
            });
        }
    },
};
