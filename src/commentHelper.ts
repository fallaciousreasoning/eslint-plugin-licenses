import { Rule } from "eslint";
import { Comment, Program } from 'estree';
import { generateTemplatedLine, lineMatches } from "./replacements";
import { Options } from "./rules/header";

export const getLeadingComments = (context: Rule.RuleContext, node: Program) => {
    const sourceCode = context.getSourceCode()
    const leading = sourceCode.getCommentsBefore(node);

    if (leading.length && leading[0].type === "Block") {
        return [leading[0]];
    }

    return leading;
}

const isAllowedType = (comment: Comment, modes: 'line' | 'block' | 'both') => {
    return comment.type.toLowerCase() === modes || modes === 'both';
}

const generateComment = (line: string, commentOptions: { isFirstLine: boolean, isLastLine: boolean, type: 'line' | 'block' }, options: Options) => {
    const padding = ''.padStart(options.leadingSpaces, ' ')
    return `${padding}${generateTemplatedLine(line)}${commentOptions.isLastLine && commentOptions.type === 'block' ? padding : ''}`
}

const generateCommentFromLines = (lines: string[], options: Options) => {
    return options.comments.prefer === 'block'
        ? `/*${lines.map(l => l.trimEnd()).join('\n')}${''.padEnd(options.leadingSpaces, ' ')}*/`
        : lines.map(l => `//${l.trimEnd()}`).join('\n')
}

export const matchesComment = (context: Rule.RuleContext, node: Program, options: Options, comments: Comment[]) => {
    comments = comments.slice(0, options.header.length + 1);

    const commentLines: {
        comment: Comment,
        line: string
    }[] = []
    for (const comment of comments) {
        const splitLines = comment.value.split('\n');
        for (const line of splitLines) {
            commentLines.push({
                line,
                comment
            })
        }
    }

    if (options.header.length > commentLines.length) {
        context.report({
            loc: { line: 1, column: 1 },
            message: 'missing license',
            fix(fixer) {
                return fixer.insertTextBefore(node,
                    generateCommentFromLines(options.header
                        .map((l, i) => generateComment(l, {
                            type: options.comments.prefer,
                            isFirstLine: i === 0,
                            isLastLine: i === options.header.length - 1
                        }, options)), options)
                    + ''.padEnd(options.trailingNewLines + 1, '\n'))
            }
        });
        return;
    }

    for (let i = 0; i < options.header.length; ++i) {
        const headerLine = options.header[i];
        const expected = ''.padStart(options.leadingSpaces, ' ') + headerLine;

        const { comment, line } = commentLines[i];
        const actual = line.trimEnd();

        if (!lineMatches(expected, actual)) {
            context.report({
                loc: comment.loc as any,
                message: `incorrect license line`,
                node: comment as any,
                fix(fixer) {
                    const start = 2 + comment.value.indexOf(line) + comment.range![0]
                    const end = start + line.length
                    return fixer.replaceTextRange([start, end], generateComment(headerLine, {
                        type: comment.type.toLowerCase() as any,
                        isFirstLine: i === 0,
                        isLastLine: i === options.header.length - 1
                    }, options))
                }
            })
        }
    }

    const badComments = comments.filter(c => !isAllowedType(c, options.comments.allow));
    if (badComments.length) {
        const first = badComments[0]
        context.report({
            loc: {
                line: comments[0].loc?.start.line ?? 1,
                column: comments[0].loc?.end.column ?? 1
            },
            message: `invalid comment type (expected '${options.comments.allow}' but was '${first.type.toLowerCase()}')`,
            fix(fixer) {
                const lines = comments.map(c => c.value.split('\n')).flatMap(c => c);
                const start = comments[0].range![0];
                const end = comments[comments.length - 1].range![1];
                return fixer.replaceTextRange([start, end], generateCommentFromLines(lines, options))
            }
        })
    }
}

