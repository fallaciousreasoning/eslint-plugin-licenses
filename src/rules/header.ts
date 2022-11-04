import eslint from 'eslint'
import { getLeadingComments, matchesComment } from '../commentHelper'

type CommentType = 'line' | 'block'
type CommentOptions = {
    allow: CommentType | 'both'
    prefer: CommentType
}

type Header = string[]

type OptionsArr = [string | number, string | CommentOptions, Header]
export interface Options {
    comment: CommentOptions,

    // Number of spaces before each line of the comment.
    leadingSpaces?: number,

    // Number of trailing newlines after the header.
    trailingNewLines?: number,
    header: Header,
    altHeaders?: Header[]
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
            type: 'object',
            properties: {
                comment: {
                    oneOf: [
                        { type: 'string', enum: ['line', 'block', 'both'] },
                        {
                            type: 'object',
                            properties: {
                                allow: {
                                    enum: ['line', 'block', 'both']
                                },
                                prefer: {
                                    enum: ['line', 'block']
                                }
                            }
                        }
                    ]
                },
                leadingSpaces: {
                    type: 'number',
                    minimum: 0,
                    default: 1,
                },
                trailingNewlines: {
                    type: 'number',
                    minimum: 0,
                    default: 1,
                },
                header: {
                    oneOf: [
                        { type: 'string' },
                        {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        }
                    ]
                }
            }
        }], // Add a schema if the rule has options
    },

    create(context) {
        const [rawOptions] = context.options as [Options]
        const options: Options = {
            leadingSpaces: 1,
            trailingNewLines: 1,
            ...rawOptions,
            header: (typeof rawOptions.header === "string" ? [rawOptions.header] : rawOptions.header)
                .flatMap(l => l.split('\n')),
            comment: typeof rawOptions.comment !== "object"
            ? {
                allow: rawOptions.comment || 'line',
                prefer: rawOptions.comment || 'line'
            } : rawOptions.comment
        }

        return {
            Program(node) {
                const comments = getLeadingComments(context, node);
                matchesComment(context, node, options, comments)
            }
        }
    },
} as eslint.Rule.RuleModule
