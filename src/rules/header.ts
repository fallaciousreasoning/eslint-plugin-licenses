import eslint from 'eslint'
import { validateHeader } from '../commentHelper'

type CommentType = 'line' | 'block'
type CommentOptions = {
    allow: CommentType | 'both'
    prefer: CommentType
}

type Header = string[]

export interface HeaderInfo {
    comment: CommentOptions
    header: Header

    // Try and use the year the file was created when setting the {YEAR}
    // variable. Otherwise the current year will be used.
    tryUseCreatedYear?: boolean;

    // Number of spaces before each line of the comment.
    leadingSpaces?: number,

    // Number of trailing newlines after the header.
    trailingNewLines?: number,
}

export interface Options extends HeaderInfo {
    altHeaders?: HeaderInfo[]
}

const headerValidator = {
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
        tryUseCreatedYear: {
            type: 'boolean'
        },
        leadingSpaces: {
            type: 'number',
            minimum: 0,
            default: 1,
        },
        trailingNewlines: {
            type: 'number',
            minimum: 0,
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
};

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
            extends: headerValidator,
            properties: {
                altHeaders: {
                    type: 'array',
                    items: {
                        oneOf: [
                            { type: 'string' },
                            { type: 'array', items: { type: 'string' } },
                            { type: 'object', extends: headerValidator }
                        ]
                    }
                }
            }

        }], // Add a schema if the rule has options
    },

    create(context) {
        const [rawOptions] = context.options as [Options]
        const comment = typeof rawOptions.comment !== "object"
            ? {
                allow: rawOptions.comment || 'line',
                prefer: rawOptions.comment || 'line'
            } : rawOptions.comment;
        const options: Options = {
            leadingSpaces: 1,
            ...rawOptions,
            header: (typeof rawOptions.header === "string" ? [rawOptions.header] : rawOptions.header)
                .flatMap(l => l.split('\n')),
            altHeaders: (rawOptions.altHeaders ?? [])
                .map(alt => {
                    if (typeof alt === "object" && !Array.isArray(alt)) {
                        return alt;
                    }

                    const headers = (typeof alt === "string" ? [alt] : alt)
                        .flatMap(l => l.split('\n'));
                    return {
                        comment,
                        header: headers
                    }
                }),
            comment
        }

        return {
            Program(node) {
                validateHeader(context, node, options)
            }
        }
    },
} as eslint.Rule.RuleModule
