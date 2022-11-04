"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateHeader = exports.getLeadingComments = void 0;
const replacements_1 = require("./replacements");
const DEFAULT_LEADING_SPACES = 1;
const DEFAULT_TRAILING_NEWLINES = 0;
const getLeadingComments = (context, node) => {
    const sourceCode = context.getSourceCode();
    const leading = sourceCode.getCommentsBefore(node);
    if (leading.length && leading[0].type === "Block") {
        return [leading[0]];
    }
    return leading;
};
exports.getLeadingComments = getLeadingComments;
const generateBody = (options) => {
    const padding = ''.padEnd(options.leadingSpaces ?? DEFAULT_LEADING_SPACES, ' ');
    return options.header.map(line => `${padding}${line}`.trimEnd());
};
const injectTemplateArgs = (lines) => {
    return lines.map(l => (0, replacements_1.generateTemplatedLine)(l));
};
const wrapComment = (mode, options, lines) => {
    const trailingNewLines = ''.padEnd((options.trailingNewLines ?? DEFAULT_TRAILING_NEWLINES) + 1, '\n');
    const leadingSpaces = ''.padEnd(options.leadingSpaces ?? DEFAULT_LEADING_SPACES, ' ');
    return (mode === 'block'
        ? `/*${lines.join('\n')}${leadingSpaces}*/`
        : lines.map(l => `//${l}`).join('\n'))
        + trailingNewLines;
};
const getLinesFromComments = (comments) => {
    return comments.flatMap(c => c.value.split('\n'));
};
const anyInvalid = (comments, options) => {
    return comments.some(c => c.type.toLowerCase() !== options.comment.allow && options.comment.allow !== 'both');
};
const validateHeader = (context, node, options) => {
    const comments = (0, exports.getLeadingComments)(context, node);
    if (!comments.length) {
        context.report({
            loc: { line: 1, column: 1 },
            message: 'missing license',
            fix(fixer) {
                return fixer
                    .insertTextBefore(node, wrapComment(options.comment.prefer, options, injectTemplateArgs(generateBody(options))));
            }
        });
        return;
    }
    const commentRange = [comments[0].range[0], comments[comments.length - 1].range[1]];
    const expectedBody = generateBody(options);
    const actualBody = getLinesFromComments(comments);
    const zipped = Array.from(Array(Math.max(expectedBody.length, actualBody.length)), (_, i) => [expectedBody[i] || '', actualBody[i] || '']);
    if (zipped.some(([expected, actual]) => !(0, replacements_1.lineMatches)(expected, actual))) {
        context.report({
            loc: {
                start: comments[0].loc.start,
                end: comments[comments.length - 1].loc.end
            },
            message: `incorrect license`,
            fix(fixer) {
                return fixer
                    .replaceTextRange(commentRange, wrapComment(comments[0].type.toLowerCase(), options, injectTemplateArgs(expectedBody)));
            }
        });
    }
    if (anyInvalid(comments, options)) {
        context.report({
            loc: {
                start: comments[0].loc.start,
                end: comments[comments.length - 1].loc.end
            },
            message: `invalid comment type (expected '${options.comment.allow}' but was '${options.comment.allow === 'line' ? 'block' : 'line'}')`,
            fix(fixer) {
                return fixer
                    .replaceTextRange(commentRange, wrapComment(options.comment.prefer, options, actualBody));
            }
        });
    }
};
exports.validateHeader = validateHeader;
