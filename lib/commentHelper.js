"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchesComment = exports.getLeadingComments = void 0;
const replacements_1 = require("./replacements");
const getLeadingComments = (context, node) => {
    const sourceCode = context.getSourceCode();
    const leading = sourceCode.getCommentsBefore(node);
    if (leading.length && leading[0].type === "Block") {
        return [leading[0]];
    }
    return leading;
};
exports.getLeadingComments = getLeadingComments;
const isAllowedType = (comment, modes) => {
    return comment.type.toLowerCase() === modes || modes === 'both';
};
const generateComment = (line, commentOptions, options) => {
    const padding = ''.padStart(options.leadingSpaces, ' ');
    return `${padding}${(0, replacements_1.generateTemplatedLine)(line)}${commentOptions.isLastLine && commentOptions.type === 'block' ? padding : ''}`;
};
const generateCommentFromLines = (lines, options) => {
    return options.comments.prefer === 'block'
        ? `/*${lines.map(l => l.trimEnd()).join('\n')}${''.padEnd(options.leadingSpaces, ' ')}*/`
        : lines.map(l => `//${l.trimEnd()}`).join('\n');
};
const matchesComment = (context, node, options, comments) => {
    comments = comments.slice(0, options.header.length + 1);
    const commentLines = [];
    for (const comment of comments) {
        const splitLines = comment.value.split('\n');
        for (const line of splitLines) {
            commentLines.push({
                line,
                comment
            });
        }
    }
    if (options.header.length > commentLines.length) {
        context.report({
            loc: { line: 1, column: 1 },
            message: comments.length ? 'incorrect license' : 'missing license',
            fix(fixer) {
                const comment = generateCommentFromLines(options.header
                    .map((l, i) => generateComment(l, {
                    type: options.comments.prefer,
                    isFirstLine: i === 0,
                    isLastLine: i === options.header.length - 1
                }, options)), options)
                    + ''.padEnd(options.trailingNewLines, '\n');
                if (comments.length) {
                    return fixer.replaceTextRange([comments[0].range[0], comments[comments.length - 1].range[1]], comment);
                }
                return fixer.insertTextBefore(node, comment + '\n');
            }
        });
        return;
    }
    for (let i = 0; i < options.header.length; ++i) {
        const headerLine = options.header[i];
        const expected = ''.padStart(options.leadingSpaces, ' ') + headerLine;
        const { comment, line } = commentLines[i];
        const actual = line.trimEnd();
        if (!(0, replacements_1.lineMatches)(expected, actual)) {
            context.report({
                loc: comment.loc,
                message: `incorrect license line`,
                node: comment,
                fix(fixer) {
                    const start = 2 + comment.value.indexOf(line) + comment.range[0];
                    const end = start + line.length;
                    return fixer.replaceTextRange([start, end], generateComment(headerLine, {
                        type: comment.type.toLowerCase(),
                        isFirstLine: i === 0,
                        isLastLine: i === options.header.length - 1
                    }, options));
                }
            });
        }
    }
    const badComments = comments.filter(c => !isAllowedType(c, options.comments.allow));
    if (badComments.length) {
        const first = badComments[0];
        context.report({
            loc: {
                line: comments[0].loc?.start.line ?? 1,
                column: comments[0].loc?.end.column ?? 1
            },
            message: `invalid comment type (expected '${options.comments.allow}' but was '${first.type.toLowerCase()}')`,
            fix(fixer) {
                const lines = comments.map(c => c.value.split('\n')).flatMap(c => c);
                const start = comments[0].range[0];
                const end = comments[comments.length - 1].range[1];
                return fixer.replaceTextRange([start, end], generateCommentFromLines(lines, options));
            }
        });
    }
};
exports.matchesComment = matchesComment;
