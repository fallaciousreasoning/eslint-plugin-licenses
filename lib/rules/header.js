"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commentHelper_1 = require("../commentHelper");
const replacements = {
    '{YEAR}': {
        match: () => /\d{4}/,
        template: () => (new Date()).getFullYear()
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
        const options = context.options;
        const comment = (0, commentHelper_1.getLeadingComment)(context);
        console.log("FOund comment", comment);
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
        };
    },
};
