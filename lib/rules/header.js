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
        const [level, mode, header] = context.options;
        return {
            Program(node) {
                const comments = (0, commentHelper_1.getLeadingComments)(context, node);
                (0, commentHelper_1.matchesComment)(context, node, {
                    comments: typeof mode === "string" ? {
                        allow: mode,
                        prefer: mode
                    } : mode,
                    header: header,
                    leadingSpaces: 1,
                    trailingNewLines: 1
                }, comments);
            }
        };
    },
};
