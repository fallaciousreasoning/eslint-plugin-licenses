"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTemplatedLine = exports.convertLine = exports.replacements = void 0;
exports.replacements = {
    '{YEAR}': {
        match: () => /(?<YEAR>\d{4})/,
        template: () => (new Date()).getFullYear()?.toString()
    }
};
const convertLine = (line) => {
    for (const [replace, entry] of Object.entries(exports.replacements)) {
        line = line.replace(replace, entry.match().source);
    }
    return new RegExp(line);
};
exports.convertLine = convertLine;
const generateTemplatedLine = (line) => {
    for (const [replace, entry] of Object.entries(exports.replacements)) {
        line = line.replace(replace, entry.template());
    }
    return line;
};
exports.generateTemplatedLine = generateTemplatedLine;
