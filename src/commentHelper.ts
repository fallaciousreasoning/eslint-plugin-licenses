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

const generateComment = (line: string, commentOptions: { isFirstLine: boolean, isLastLine: boolean }, options: Options) => {
    const padding = ''.padStart(options.leadingSpaces, ' ')
    const prefix = options.comments.prefer === 'line'
        ? '//'
        : commentOptions.isFirstLine
            ? '/*'
            : '';
    const suffix = options.comments.prefer === 'line'
        ? ''
        : commentOptions.isLastLine
            ? '*/'
            : ''
    return `${prefix}${padding}${generateTemplatedLine(line)}${padding}${suffix}`.trimEnd()
}

export const matchesComment = (context: Rule.RuleContext, node: Program, options: Options, comments: Comment[]) => {
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
                return fixer.insertTextBefore(node, options.header
                    .map((l, i) => generateComment(l, {
                        isFirstLine: i === 0,
                        isLastLine: i === options.header.length - 1
                    }, options))
                    .join('\n') + ''.padEnd(options.trailingNewLines + 1, '\n'))
            }
        });
        return;
    }

    for (let i = 0; i < options.header.length; ++i) {
        const headerLine = options.header[i];
        const expected = ''.padStart(options.leadingSpaces, ' ') + headerLine;

        const { comment, line} = commentLines[i];
        const actual = line.trimEnd();

        if (!lineMatches(expected, actual)) {
            context.report({
                loc: comment.loc as any,
                message: `incorrect license line`,
                node: comment as any,
                fix(fixer) {
                    const start = comment.value.indexOf(line) + comment.range![0]
                    // Add two for line comments (//) add four for block (/**/)
                    const end = start + line.length + (comment.type === 'Block' ? 4  :2)
                    return fixer.replaceTextRange([start, end], generateComment(headerLine, {
                        isFirstLine: i === 0,
                        isLastLine: i === options.header.length - 1
                    }, options))
                }
            })
        } 
        
        if (!isAllowedType(comment, options.comments.allow)) {
            context.report({
                loc: comment.loc as any,
                message: `invalid comment type (expected '${options.comments.allow}' but was '${comment.type.toLowerCase()}')`,
                fix(fixer) {
                    return fixer.replaceText(comment as any, generateComment(headerLine, {
                        isFirstLine: i === 0,
                        isLastLine: i === options.header.length - 1
                    }, options))
                }
            })
        }
    }
}
