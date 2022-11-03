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
const generateCommentFromLines = (lines, mode) => {
    return mode === 'block'
        ? `/*${lines.join('\n')}*/`
        : lines.map(l => `//${l}`).join('\n');
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
                return fixer.insertTextBefore(node, generateCommentFromLines(options.header
                    .map((l, i) => generateComment(l, {
                    type: options.comments.prefer,
                    isFirstLine: i === 0,
                    isLastLine: i === options.header.length - 1
                }, options)), options.comments.prefer)
                    + ''.padEnd(options.trailingNewLines + 1, '\n'));
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
        // if (!isAllowedType(comment, options.comments.allow)) {
        //     context.report({
        //         loc: comment.loc as any,
        //         message: `invalid comment type (expected '${options.comments.allow}' but was '${comment.type.toLowerCase()}')`,
        //         fix(fixer) {
        //             return fixer.replaceText(comment as any, generateComment(headerLine, {
        //                 type: options.comments.prefer,
        //                 isFirstLine: i === 0,
        //                 isLastLine: i === options.header.length - 1
        //             }, options))
        //         }
        //     })
    }
};
exports.matchesComment = matchesComment;
