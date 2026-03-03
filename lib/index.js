"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = exports.meta = void 0;
const header = require("./rules/header");
exports.meta = {
    name: 'eslint-plugin-licenses',
    version: '2.0.0'
};
exports.rules = {
    header
};
