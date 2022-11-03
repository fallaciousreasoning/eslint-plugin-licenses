export const replacements = {
    '{YEAR}': {
        match: () => /(?<YEAR>\d{4})/,
        template: () => (new Date()).getFullYear()?.toString()
    }
}

export const convertLine = (line: string) => {
    for (const [replace, entry] of Object.entries(replacements)) {
        line = line.replace(replace, entry.match().source)
    }
    return new RegExp(line);
}

export const generateTemplatedLine = (line: string) => {
    for (const [replace, entry] of Object.entries(replacements)) {
        line = line.replace(replace, entry.template())
    }
    return line;
}
