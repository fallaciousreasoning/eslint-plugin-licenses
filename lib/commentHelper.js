"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchesComment = exports.getLeadingComments = void 0;
const replacements_1 = require("./replacements");
const getLeadingComments = (context) => {
    const sourceCode = context.getSourceCode();
    const firstToken = sourceCode.getFirstToken(sourceCode.ast);
    if (!firstToken)
        return [];
    return sourceCode.getCommentsBefore(firstToken);
};
exports.getLeadingComments = getLeadingComments;
const isAllowedType = (comment, modes) => {
    return comment.type.toLowerCase() === modes || modes === 'both';
};
const generateComment = (line, options) => {
    const padding = ''.padStart(options.leadingSpaces, ' ');
    const prefix = options.comments.prefer === 'line' ? '//' : '/*';
    const suffix = options.comments.prefer === 'line' ? '' : `${padding}*/`;
    return `${prefix}${padding}${(0, replacements_1.generateTemplatedLine)(line)}${suffix}`;
};
const matchesComment = (context, node, options, comments) => {
    if (options.header.length > comments.length) {
        context.report({
            loc: { line: 1, column: 1 },
            message: 'missing license',
            fix(fixer) {
                return fixer.insertTextBefore(node, options.header
                    .map(l => generateComment(l, options))
                    .join('\n') + ''.padEnd(options.trailingNewLines + 1, '\n'));
            }
        });
        return;
    }
    for (let i = 0; i < options.header.length; ++i) {
        const headerLine = options.header[i];
        const expected = ''.padStart(options.leadingSpaces, ' ') + headerLine;
        const comment = comments[i];
        const actual = comment.value.trimEnd();
        if (!(0, replacements_1.lineMatches)(expected, actual)) {
            context.report({
                loc: comment.loc,
                message: `incorrect license line`,
                node: comment,
                fix(fixer) {
                    return fixer.replaceText(comment, generateComment(headerLine, options));
                }
            });
        }
        if (!isAllowedType(comment, options.comments.allow)) {
            context.report({
                loc: comment.loc,
                message: `invalid comment type (expected '${options.comments.allow}' but was '${comment.type.toLowerCase()}')`,
                fix(fixer) {
                    return fixer.replaceText(comment, generateComment(headerLine, options));
                }
            });
        }
    }
};
exports.matchesComment = matchesComment;
