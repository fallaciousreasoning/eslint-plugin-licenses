"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commentHelper_1 = require("../commentHelper");
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
        type: 'suggestion',
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
        const [rawOptions] = context.options;
        const comment = typeof rawOptions.comment !== "object"
            ? {
                allow: rawOptions.comment || 'line',
                prefer: rawOptions.comment || 'line'
            } : rawOptions.comment;
        const options = {
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
                };
            }),
            comment
        };
        return {
            Program(node) {
                (0, commentHelper_1.validateHeader)(context, node, options);
            }
        };
    },
};
