export const replacements: {
    [key: string]: {
        match: () => RegExp,
        template: () => string
    }
} = {
    '{YEAR}': {
        match: () => /\d{4}/,
        template: () => (new Date()).getFullYear()?.toString()
    }
}

export const lineMatches = (headerLine: string, comment: string) => {
    const parts = headerLine
        .split(/(\{[a-zA-Z]+\})/)
    let index = 0;

    for (let i = 0; i < parts.length; ++i) {
        const part = parts[i];
        const replacement = replacements[part];
        if (!replacement) {
            const ss = comment.substring(index, index + part.length)
            if (part !== ss) {
                console.log(part, '!==', ss)
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

export const generateTemplatedLine = (line: string) => {
    for (const [replace, entry] of Object.entries(replacements)) {
        line = line.replace(replace, entry.template())
    }
    return line;
}
