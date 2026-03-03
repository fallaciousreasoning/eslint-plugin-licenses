"use strict";

const js = require("@eslint/js");
const eslintPlugin = require("eslint-plugin-eslint-plugin");
const nPlugin = require("eslint-plugin-n");

module.exports = [
  js.configs.recommended,
  eslintPlugin.configs["flat/recommended"],
  nPlugin.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        require: "readonly",
        module: "writable",
        exports: "writable",
        __dirname: "readonly",
        __filename: "readonly",
        process: "readonly",
      },
    },
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        before: "readonly",
        after: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
  },
];
