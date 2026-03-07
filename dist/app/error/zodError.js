"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reformZodError = (err) => {
    // Map all issues safely
    const errorSource = err.issues.map((issue) => {
        var _a;
        const path = issue.path.length
            ? String(issue.path[issue.path.length - 1])
            : 'root';
        return {
            path,
            message: (_a = issue.message) !== null && _a !== void 0 ? _a : 'Invalid value',
        };
    });
    // Summary message
    const errorMessage = errorSource.map((err) => `${err.path}`).join(', ');
    return {
        message: `Validation Error: ${errorMessage} is required`,
        errorSource,
    };
};
exports.default = reformZodError;
