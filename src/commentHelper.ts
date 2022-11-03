import { Rule } from "eslint";
import { Comment } from 'estree'
import { rules } from "./index";
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

export const matchesComment = (context: Rule.RuleContext, options: Options, comments: Comment[]) => {
    let errors = []
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
                loc: comment.loc as any,
                message: `incorrect license line (expected '${expected}' but was '${actual}')`,
                node: comment as any
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
