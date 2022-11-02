"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeadingComment = void 0;
const getLeadingComment = (context) => {
    const sourceCode = context.getSourceCode();
    const firstToken = sourceCode.getFirstToken(sourceCode.ast, { includeComments: true });
    if (!firstToken || firstToken?.type !== 'Line')
        return '';
    return firstToken.value;
};
exports.getLeadingComment = getLeadingComment;
