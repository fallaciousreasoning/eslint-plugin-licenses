import { Rule } from "eslint";

export const getLeadingComment = (context: Rule.RuleContext) => {
        const sourceCode = context.getSourceCode()
        const firstToken = sourceCode.getFirstToken(sourceCode.ast, { includeComments: true })

        if (!firstToken || firstToken?.type !== 'Line')
            return ''

        return firstToken.value
    }
