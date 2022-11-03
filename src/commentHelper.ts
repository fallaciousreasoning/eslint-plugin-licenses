import { Rule } from "eslint";
import { Comment, Program } from 'estree'
import { rules } from "./index";
import { convertLine, generateTemplatedLine } from "./replacements";
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

export const matchesComment = (context: Rule.RuleContext, node: Program, options: Options, comments: Comment[]) => {
    let errors = []
    if (options.header.length > comments.length) {
        context.report({
            loc: { line: 1, column: 1 },
            message: 'missing license',
            fix(fixer) {
                return fixer.insertTextBefore(node, options.header
                    .map(line => generateTemplatedLine(line))
                    .map(l => ''.padStart(options.leadingSpaces, ' ') + l)
                    .map(l => options.comments.prefer === 'block' ? '' : '//' + l)
                    .join('\n') + ''.padEnd(options.trailingNewLines + 1, '\n'))
            }
        });
        return;
    }

    for (let i = 0; i < options.header.length; ++i) {
        const expected = ''.padStart(options.leadingSpaces, ' ') + options.header[i];
        const expectedRegex = convertLine(expected);

        const comment = comments[i];
        const actual = comment.value.trimEnd();

        if (!expectedRegex.test(actual)) {
            context.report({
                loc: comment.loc as any,
                message: `incorrect license line (expected '${expected}' but was '${actual}')`,
                node: comment as any,
            })
        }

        if (!isAllowedType(comment, options.comments.allow)) {
            context.report({
                loc: comment.loc as any,
                message: `invalid comment type (expected '${options.comments.allow}' but was '${comment.type.toLowerCase()}')`
            })
        }
    }
}
