"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchesComment = exports.getLeadingComments = void 0;
const getLeadingComments = (context) => {
    const sourceCode = context.getSourceCode();
    const firstToken = sourceCode.getFirstToken(sourceCode.ast);
    if (!firstToken)
        return [];
    return sourceCode.getCommentsBefore(firstToken);
};
exports.getLeadingComments = getLeadingComments;
const isAllowedType = (comment, modes) => {
    return comment.type.toLowerCase() != modes && modes != 'both';
};
const matchesComment = (context, options, comments) => {
    let errors = [];
    if (options.header.length > comments.length) {
        context.report({
            loc: { line: 1, column: 1 },
            message: 'missing license'
        });
        return;
    }
    for (let i = 0; i < options.header.length; ++i) {
        const expected = ''.padStart(options.leadingSpaces, ' ') + options.header[i];
        const comment = comments[i];
        const actual = comment.value.trimEnd();
        if (expected !== actual) {
            context.report({
                loc: comment.loc,
                message: `incorrect license line (expected '${expected}' but was '${actual}')`,
                node: comment
            });
        }
    }
};
exports.matchesComment = matchesComment;
