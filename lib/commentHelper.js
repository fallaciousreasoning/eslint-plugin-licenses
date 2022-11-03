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
    const prefix = options.comments.prefer === 'line'
        ? '//'
        : commentOptions.isFirstLine
            ? '/*'
            : '';
    const suffix = options.comments.prefer === 'line'
        ? ''
        : commentOptions.isLastLine
            ? '*/'
            : '';
    return `${prefix}${padding}${(0, replacements_1.generateTemplatedLine)(line)}${padding}${suffix}`.trimEnd();
};
const matchesComment = (context, node, options, comments) => {
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
            message: 'missing license',
            fix(fixer) {
                return fixer.insertTextBefore(node, options.header
                    .map((l, i) => generateComment(l, {
                    isFirstLine: i === 0,
                    isLastLine: i === options.header.length - 1
                }, options))
                    .join('\n') + ''.padEnd(options.trailingNewLines + 1, '\n'));
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
                    const start = comment.value.indexOf(line) + comment.range[0];
                    // Add two for line comments (//) add four for block (/**/)
                    const end = start + line.length + (comment.type === 'Block' ? 4 : 2);
                    return fixer.replaceTextRange([start, end], generateComment(headerLine, {
                        isFirstLine: i === 0,
                        isLastLine: i === options.header.length - 1
                    }, options));
                }
            });
        }
        if (!isAllowedType(comment, options.comments.allow)) {
            context.report({
                loc: comment.loc,
                message: `invalid comment type (expected '${options.comments.allow}' but was '${comment.type.toLowerCase()}')`,
                fix(fixer) {
                    return fixer.replaceText(comment, generateComment(headerLine, {
                        isFirstLine: i === 0,
                        isLastLine: i === options.header.length - 1
                    }, options));
                }
            });
        }
    }
};
exports.matchesComment = matchesComment;
