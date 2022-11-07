import { execSync } from 'child_process';

export const getYearForFile = (filePath: string, tryUseCreatedYear: boolean) => {
    if (!tryUseCreatedYear) {
        return new Date().getFullYear();
    }

    try {
        const result = execSync(`git log --follow --format=%ad --date default -- "${filePath}"`).toString('utf8');
        const modifyDates = result.split('\n');
        const firstModify = modifyDates[modifyDates.length - 1];
        return new Date(firstModify).getFullYear();
    } catch (err) {
        // Fallback to the current year if our git command failed.
        return new Date().getFullYear();
    }
}
