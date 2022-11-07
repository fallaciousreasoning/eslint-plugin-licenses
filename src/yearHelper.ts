import { execSync } from 'child_process';

const fileYears: { [filePath: string]: number } = {};

export const getYearForFile = (filePath: string, tryUseCreatedYear: boolean) => {
    if (!tryUseCreatedYear) {
        return new Date().getFullYear();
    }

    // Note: We cache the file year because it's pretty slow to calculate.
    if (!fileYears[filePath]) {
        try {
            const result = execSync(`git log --follow --format=%ad --date default -- "${filePath}"`).toString('utf8');
            const modifyDates = result.trim().split('\n');
            const firstModify = modifyDates[modifyDates.length - 1];
            const year = new Date(firstModify).getFullYear();
            fileYears[filePath] = isNaN(year) ? new Date().getFullYear() : year;
        } catch (err) {
            // Fallback to the current year if our git command failed.
            fileYears[filePath] = new Date().getFullYear();
        }
    }
    return fileYears[filePath];
}
