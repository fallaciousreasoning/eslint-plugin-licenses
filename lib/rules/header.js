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
        const [level, mode, header] = context.options;
        const comments = (0, commentHelper_1.getLeadingComments)(context);
        return {
            Program(node) {
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
