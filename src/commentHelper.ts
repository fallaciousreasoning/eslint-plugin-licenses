import { Rule } from "eslint";
import { Comment, Program } from 'estree'
import { rules } from "./index";
import { convertLine, generateTemplatedLine, lineMatches } from "./replacements";
import { Options } from "./rules/header";

export const getLeadingComments = (context: Rule.RuleContext) => {
    const sourceCode = context.getSourceCode()
    const firstToken = sourceCode.getFirstToken(sourceCode.ast)
    if (!firstToken) return []

    return sourceCode.getCommentsBefore(firstToken)
}

const isAllowedType = (comment: Comment, modes: 'line' | 'block' | 'both') => {
    return comment.type.toLowerCase() === modes || modes === 'both';
}

const generateComment = (line: string, options: Options) => {
    const padding = ''.padStart(options.leadingSpaces, ' ')
    const prefix = options.comments.prefer === 'line' ? '//' : '/*'
    const suffix = options.comments.prefer === 'line' ? '' : `${padding}*/`
    return `${prefix}${padding}${generateTemplatedLine(line)}${suffix}`
}

export const matchesComment = (context: Rule.RuleContext, node: Program, options: Options, comments: Comment[]) => {
    if (options.header.length > comments.length) {
        context.report({
            loc: { line: 1, column: 1 },
            message: 'missing license',
            fix(fixer) {
                return fixer.insertTextBefore(node, options.header
                    .map(l => generateComment(l, options))
                    .join('\n') + ''.padEnd(options.trailingNewLines + 1, '\n'))
            }
        });
        return;
    }

    for (let i = 0; i < options.header.length; ++i) {
        const headerLine = options.header[i];
        const expected = ''.padStart(options.leadingSpaces, ' ') + headerLine;

        const comment = comments[i];
        const actual = comment.value.trimEnd();

        if (!lineMatches(expected, actual)) {
            context.report({
                loc: comment.loc as any,
                message: `incorrect license line`,
                node: comment as any,
                fix(fixer) {
                    return fixer.replaceText(comment as any, generateComment(headerLine, options))
                }
            })
        } 
        
        if (!isAllowedType(comment, options.comments.allow)) {
            context.report({
                loc: comment.loc as any,
                message: `invalid comment type (expected '${options.comments.allow}' but was '${comment.type.toLowerCase()}')`,
                fix(fixer) {
                    return fixer.replaceText(comment as any, generateComment(headerLine, options))
                }
            })
        }
    }
}
