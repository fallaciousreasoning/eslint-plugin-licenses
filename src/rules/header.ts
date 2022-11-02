import eslint from 'eslint'
export default {
    meta: {
        type: 'suggestion', // `problem`, `suggestion`, or `layout`
        docs: {
            description: "Ensures that source files have a license header",
            recommended: false,
            url: 'https://github.com/fallaciousreasoning/eslint-plugin-licenses',
        },
        fixable: 'code',
        schema: [], // Add a schema if the rule has options
    },

    create(context) {
        return {

        }
    },
} as eslint.Rule.RuleModule
