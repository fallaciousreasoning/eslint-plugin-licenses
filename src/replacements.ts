import { HeaderInfo } from "./rules/header";
import { Program } from 'estree';
import { getYearForFile } from "./yearHelper";

export const replacements: {
    [key: string]: {
        match: () => RegExp,
        template: (filePath: string, headerInfo: HeaderInfo) => string
    }
} = {
    '{YEAR}': {
        match: () => /\d{4}/,
        template: (filePath: string, headerInfo: HeaderInfo) => getYearForFile(filePath, headerInfo.tryUseCreatedYear ?? false).toString()
    }
}

export const lineMatches = (headerLine: string, comment: string) => {
    if (headerLine.trim().length === 0 && comment.trim().length === 0) {
        return true;
    }

    const parts = headerLine
        .split(/(\{[a-zA-Z]+\})/)
    let index = 0;

    for (let i = 0; i < parts.length; ++i) {
        const part = parts[i];
        const replacement = replacements[part];
        if (!replacement) {
            const ss = comment.substring(index, index + part.length)
            if (part !== ss) {
                return false;
            }
            index += part.length;
            continue
        }

        const match = replacement.match().exec(comment.substring(index));
        if (!match) return false

        index += match[0].length;
    }

    return true;
}

export const generateTemplatedLine = (line: string, filePath: string, headerInfo: HeaderInfo) => {
    for (const [replace, entry] of Object.entries(replacements)) {
        // Don't generate the template, unless we need to - it can be expensive.
        if (!line.includes(replace)) continue;

        line = line.replace(replace, entry.template(filePath, headerInfo))
    }
    return line;
}
