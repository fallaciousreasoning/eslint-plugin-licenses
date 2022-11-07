"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYearForFile = void 0;
const child_process_1 = require("child_process");
const getYearForFile = (filePath, tryUseCreatedYear) => {
    if (!tryUseCreatedYear) {
        return new Date().getFullYear();
    }
    try {
        const result = (0, child_process_1.execSync)(`git log --follow --format=%ad --date default -- "${filePath}"`).toString('utf8');
        const modifyDates = result.split('\n');
        const firstModify = modifyDates[modifyDates.length - 1];
        return new Date(firstModify).getFullYear();
    }
    catch (err) {
        // Fallback to the current year if our git command failed.
        return new Date().getFullYear();
    }
};
exports.getYearForFile = getYearForFile;
