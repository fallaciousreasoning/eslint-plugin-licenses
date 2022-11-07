"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYearForFile = void 0;
const child_process_1 = require("child_process");
const fileYears = {};
const getYearForFile = (filePath, tryUseCreatedYear) => {
    if (!tryUseCreatedYear) {
        return new Date().getFullYear();
    }
    // Note: We cache the file year because it's pretty slow to calculate.
    if (!fileYears[filePath]) {
        try {
            const result = (0, child_process_1.execSync)(`git log --follow --format=%ad --date default -- "${filePath}"`).toString('utf8');
            const modifyDates = result.trim().split('\n');
            const firstModify = modifyDates[modifyDates.length - 1];
            const year = new Date(firstModify).getFullYear();
            fileYears[filePath] = isNaN(year) ? new Date().getFullYear() : year;
        }
        catch (err) {
            // Fallback to the current year if our git command failed.
            fileYears[filePath] = new Date().getFullYear();
        }
    }
    return fileYears[filePath];
};
exports.getYearForFile = getYearForFile;
