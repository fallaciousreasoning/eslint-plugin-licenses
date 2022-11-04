"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateHeader = exports.getLeadingComments = void 0;
const replacements_1 = require("./replacements");
const DEFAULT_LEADING_SPACES = 1;
const DEFAULT_TRAILING_NEWLINES = 0;
const zip = (a, b, defaultA = undefined, defaultB = undefined) => {
    return Array.from(Array(Math.max(a.length, b.length)), (_, i) => [a[i] ?? defaultA, b[i] ?? defaultB]);
};
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
const wrapComment = (options, lines) => {
    const leadingSpaces = ''.padEnd(options.leadingSpaces ?? DEFAULT_LEADING_SPACES, ' ');
    return (options.comment.prefer === 'block'
        ? `/*${lines.join('\n')}${leadingSpaces}*/`
        : lines.map(l => `//${l.trimEnd()}`).join('\n'));
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
                    .insertTextBefore(node, wrapComment(options, injectTemplateArgs(generateBody(options))) + '\n');
            }
        });
        return;
    }
    const commentRange = [comments[0].range[0], comments[comments.length - 1].range[1]];
    const expectedBody = generateBody(options);
    const actualBody = getLinesFromComments(comments);
    const alternateBodies = (options.altHeaders ?? []).map(a => generateBody(a));
    const possibilities = [expectedBody, ...alternateBodies].map(expectLines => zip(expectLines, actualBody, '', ''));
    const possibilityValid = (possibility) => possibility.every(([expected, actual]) => (0, replacements_1.lineMatches)(expected, actual));
    if (!possibilities.some(possibilityValid)) {
        context.report({
            loc: {
                start: comments[0].loc.start,
                end: comments[comments.length - 1].loc.end
            },
            message: `incorrect license`,
            fix(fixer) {
                return fixer
                    .replaceTextRange(commentRange, wrapComment(options, injectTemplateArgs(expectedBody)));
            }
        });
    }
    else if (anyInvalid(comments, options)) {
        context.report({
            loc: {
                start: comments[0].loc.start,
                end: comments[comments.length - 1].loc.end
            },
            message: `invalid comment type (expected '${options.comment.allow}' but was '${options.comment.allow === 'line' ? 'block' : 'line'}')`,
            fix(fixer) {
                return fixer
                    .replaceTextRange(commentRange, wrapComment(options, actualBody));
            }
        });
    }
};
exports.validateHeader = validateHeader;
