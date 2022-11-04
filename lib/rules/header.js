"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commentHelper_1 = require("../commentHelper");
module.exports = {
    meta: {
        type: 'suggestion',
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
        const [rawOptions] = context.options;
        const options = {
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
        };
        return {
            Program(node) {
                const comments = (0, commentHelper_1.getLeadingComments)(context, node);
                (0, commentHelper_1.matchesComment)(context, node, options, comments);
            }
        };
    },
};
