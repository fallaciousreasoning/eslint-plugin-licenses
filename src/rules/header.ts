import eslint from 'eslint'
import { getLeadingComment } from '../commentHelper'

type CommentType = 'line' | 'block'
type CommentOptions = {
    allow: CommentType | 'both'
    prefer: CommentType
}

type Header = string[]

type Options = [CommentOptions, Header]

const replacements = {
    '{YEAR}': {
        match: () => /\d{4}/,
        template: () => (new Date()).getFullYear()
    }
}

module.exports = {
    meta: {
        type: 'suggestion', // `problem`, `suggestion`, or `layout`
        docs: {
            description: "Ensures that source files have a license header",
            recommended: false,
            url: 'https://github.com/fallaciousreasoning/eslint-plugin-licenses',
        },
        fixable: 'code',
        schema: [{
            type: 'number'
        }, {
            type: 'string'
        }, {
            oneOf: [{
                type: 'string'
            }, {
                type: 'array',
                items: {
                    type: 'string'
                }
            }]
        }], // Add a schema if the rule has options
    },

    create(context) {
        const options: Options = context.options as any
        const comment = getLeadingComment(context);
        console.log("FOund comment", comment)
        return {
            Program(node) {
                if (!comment) {
                    context.report({
                        loc: { line: 1, column: 1 },
                        message: 'missing header',

                    });
                    return;
                }
            }
        }
    },
} as eslint.Rule.RuleModule
