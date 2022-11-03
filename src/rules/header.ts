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
    comments: CommentOptions,

    // Number of spaces before each line of the comment.
    leadingSpaces: number,

    // Number of trailing newlines after the header.
    trailingNewLines: number,
    header: Header
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
        const [level, mode, header] = context.options as OptionsArr

        return {
            Program(node) {
                const comments = getLeadingComments(context, node);
                matchesComment(context, node, {
                    comments: typeof mode === "string" ? {
                        allow: mode,
                        prefer: mode
                    } : mode as any,
                    header: header,
                    leadingSpaces: 1,
                    trailingNewLines: 1
                }, comments)
            }
        }
    },
} as eslint.Rule.RuleModule
