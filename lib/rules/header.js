"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    meta: {
        type: 'suggestion',
        docs: {
            description: "Ensures that source files have a license header",
            recommended: false,
            url: 'https://github.com/fallaciousreasoning/eslint-plugin-licenses',
        },
        fixable: 'code',
        schema: [], // Add a schema if the rule has options
    },
    create(context) {
        return {};
    },
};
