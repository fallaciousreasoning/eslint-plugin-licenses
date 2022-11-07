import { HeaderInfo, Options } from "./rules/header";
import { Comment, Program } from 'estree'
import { Rule } from "eslint";
import { generateTemplatedLine, lineMatches } from "./replacements";

const DEFAULT_LEADING_SPACES = 1;
const DEFAULT_TRAILING_NEWLINES = 0;

const zip = <A, B>(a: A[], b: B[], defaultA: A = undefined as any, defaultB: B = undefined as any): [A, B][] => {
    return Array.from(Array(Math.max(a.length, b.length)), (_, i) => [a[i] ?? defaultA, b[i] ?? defaultB]);
}

export const getLeadingComments = (context: Rule.RuleContext, node: Program) => {
    const sourceCode = context.getSourceCode()
    const leading = sourceCode.getCommentsBefore(node);

    if (leading.length && leading[0].type === "Block") {
        return [leading[0]];
    }

    return leading;
}

const generateBody = (options: HeaderInfo) => {
    const padding = ''.padEnd(options.leadingSpaces ?? DEFAULT_LEADING_SPACES, ' ');
    return options.header.map(line => `${padding}${line}`.trimEnd());
}

const wrapComment = (options: HeaderInfo, lines: string[]) => {
    const leadingSpaces = ''.padEnd(options.leadingSpaces ?? DEFAULT_LEADING_SPACES, ' ');
    return (options.comment.prefer === 'block'
        ? `/*${lines.join('\n')}${leadingSpaces}*/`
        : lines.map(l => `//${l.trimEnd()}`).join('\n'));
}

const getLinesFromComments = (comments: Comment[]) => {
    return comments.flatMap(c => c.value.split('\n'));
}

const anyInvalid = (comments: Comment[], options: Options) => {
    return comments.some(c => c.type.toLowerCase() !== options.comment.allow && options.comment.allow !== 'both');
}

export const validateHeader = (context: Rule.RuleContext, node: Program, options: Options) => {
    const injectTemplateArgs = (lines: string[]) => {
        return lines.map(l => generateTemplatedLine(l, context.getFilename(), options));
    }

    const comments = getLeadingComments(context, node);
    if (!comments.length) {
        context.report({
            loc: { line: 1, column: 1 },
            message: 'missing license',
            fix(fixer) {
                return fixer
                    .insertTextBefore(node,
                        wrapComment(options,
                            injectTemplateArgs(generateBody(options))) + '\n')
            }
        });
        return;
    }

    const commentRange = [comments[0].range![0], comments[comments.length - 1].range![1]] as [number, number];
    const expectedBody = generateBody(options);
    const actualBody = getLinesFromComments(comments);
    const alternateBodies = (options.altHeaders ?? []).map(a => generateBody(a));
    const possibilities = [expectedBody, ...alternateBodies].map(expectLines => zip(expectLines, actualBody, '', ''));
    const possibilityValid = (possibility: [string, string][]) => possibility.every(([expected, actual]) => lineMatches(expected, actual));
    if (!possibilities.some(possibilityValid)) {
        context.report({
            loc: {
                start: comments[0].loc!.start,
                end: comments[comments.length - 1].loc!.end
            },
            message: `incorrect license`,
            fix(fixer) {
                return fixer
                    .replaceTextRange(commentRange,
                        wrapComment(options, injectTemplateArgs(expectedBody)))
            }
        })
    } else if (anyInvalid(comments, options)) {
        context.report({
            loc: {
                start: comments[0].loc!.start,
                end: comments[comments.length - 1].loc!.end
            },
            message: `invalid comment type (expected '${options.comment.allow}' but was '${options.comment.allow === 'line' ? 'block' : 'line'}')`,
            fix(fixer) {
                return fixer
                    .replaceTextRange(commentRange, wrapComment(options, actualBody))
            }
        })
    }
}
