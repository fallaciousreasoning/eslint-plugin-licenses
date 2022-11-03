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
const matchesComment = (context, node, options, comments) => {
    let errors = [];
    if (options.header.length > comments.length) {
        context.report({
            loc: { line: 1, column: 1 },
            message: 'missing license',
            fix(fixer) {
                return fixer.insertTextBefore(node, options.header
                    .map(line => (0, replacements_1.generateTemplatedLine)(line))
                    .map(l => ''.padStart(options.leadingSpaces, ' ') + l)
                    .map(l => options.comments.prefer === 'block' ? '' : '//')
                    .join('\n'));
            }
        });
        return;
    }
    for (let i = 0; i < options.header.length; ++i) {
        const expected = ''.padStart(options.leadingSpaces, ' ') + options.header[i];
        const expectedRegex = (0, replacements_1.convertLine)(expected);
        const comment = comments[i];
        const actual = comment.value.trimEnd();
        if (!expectedRegex.test(actual)) {
            context.report({
                loc: comment.loc,
                message: `incorrect license line (expected '${expected}' but was '${actual}')`,
                node: comment,
            });
        }
        if (!isAllowedType(comment, options.comments.allow)) {
            context.report({
                loc: comment.loc,
                message: `invalid comment type (expected '${options.comments.allow}' but was '${comment.type.toLowerCase()}')`
            });
        }
    }
};
exports.matchesComment = matchesComment;
