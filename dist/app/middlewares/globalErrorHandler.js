"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
// import reformZodError from '../error/zoodError';
// import mongoseErrorHandeller from '../error/mongooseErrorHandler';
// import dublicateErrorHandellerr from '../error/duplicateError';
// import { TErrorSource } from '../constents';
const AppError_1 = __importDefault(require("../error/AppError"));
const zodError_1 = __importDefault(require("../error/zodError"));
const mongooseError_1 = __importDefault(require("../error/mongooseError"));
const duplicateError_1 = __importDefault(require("../error/duplicateError"));
const globalErrorHandler = (err, req, res, next) => {
    // setting default value
    var _a;
    let statusCode = err.statusCode || 500;
    let message = err.message || 'something Went Wrong';
    let errorSource = [
        {
            path: '',
            message: 'something went wrong',
        },
    ];
    if (err instanceof zod_1.ZodError) {
        const handaleZoderror = (0, zodError_1.default)(err);
        statusCode = 400;
        message = handaleZoderror.message;
        errorSource = handaleZoderror.errorSource;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === 'ValidationError') {
        const mongoseErrorHandellerr = (0, mongooseError_1.default)(err);
        statusCode = mongoseErrorHandellerr === null || mongoseErrorHandellerr === void 0 ? void 0 : mongoseErrorHandellerr.statusCode;
        errorSource = mongoseErrorHandellerr === null || mongoseErrorHandellerr === void 0 ? void 0 : mongoseErrorHandellerr.errorSource;
        message = mongoseErrorHandellerr.message;
    }
    else if (((_a = err === null || err === void 0 ? void 0 : err.errorResponse) === null || _a === void 0 ? void 0 : _a.code) === 11000) {
        const dublicateErrorHandeller = (0, duplicateError_1.default)(err);
        statusCode = dublicateErrorHandeller.statuscode;
        message = dublicateErrorHandeller.message;
        errorSource = dublicateErrorHandeller.errorSource;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        message = err.message;
        errorSource = [
            {
                path: '',
                message: err === null || err === void 0 ? void 0 : err.message,
            },
        ];
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
        errorSource = [
            {
                path: '',
                message: err === null || err === void 0 ? void 0 : err.message,
            },
        ];
    }
    res.status(statusCode).json({
        success: false,
        message: message,
        errorSource,
        theError: err.stack,
        error: err,
        // stack: config.nodeEnv === 'development' ? err.stack : null,
    });
};
exports.default = globalErrorHandler;
