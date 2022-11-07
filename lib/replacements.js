"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTemplatedLine = exports.lineMatches = exports.replacements = void 0;
const yearHelper_1 = require("./yearHelper");
exports.replacements = {
    '{YEAR}': {
        match: () => /\d{4}/,
        template: (filePath, headerInfo) => (0, yearHelper_1.getYearForFile)(filePath, headerInfo.tryUseCreatedYear ?? false).toString()
    }
};
const lineMatches = (headerLine, comment) => {
    if (headerLine.trim().length === 0 && comment.trim().length === 0) {
        return true;
    }
    const parts = headerLine
        .split(/(\{[a-zA-Z]+\})/);
    let index = 0;
    for (let i = 0; i < parts.length; ++i) {
        const part = parts[i];
        const replacement = exports.replacements[part];
        if (!replacement) {
            const ss = comment.substring(index, index + part.length);
            if (part !== ss) {
                return false;
            }
            index += part.length;
            continue;
        }
        const match = replacement.match().exec(comment.substring(index));
        if (!match)
            return false;
        index += match[0].length;
    }
    return true;
};
exports.lineMatches = lineMatches;
const generateTemplatedLine = (line, filePath, headerInfo) => {
    for (const [replace, entry] of Object.entries(exports.replacements)) {
        line = line.replace(replace, entry.template(filePath, headerInfo));
    }
    return line;
};
exports.generateTemplatedLine = generateTemplatedLine;
