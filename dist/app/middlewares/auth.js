"use strict";
// import { NextFunction, Request, Response } from 'express';
// import { JwtPayload } from 'jsonwebtoken';
// import catchAsync from '../utils/catchAsync';
// import status from 'http-status';
// import ApppError from '../error/AppError';
// import jwt from 'jsonwebtoken';
// import config from '../config';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import authUtill from '../modules/auth/auth.utill';
// import catchAsync from '../util/catchAsync';
// import { TUserRole } from '../constents';
// import idConverter from '../util/idConvirter';
const AppError_1 = __importDefault(require("../error/AppError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const generateToken_1 = require("../utils/generateToken");
// import { StatusCodes } from 'http-status-codes';
const auth = (...requeredUserRole) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const authorizationToken = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
        console.log({ requeredUserRole, authorizationToken });
        if (!authorizationToken) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized User: Missing Authorization Token');
        }
        const decoded = (0, generateToken_1.decodeToken)(authorizationToken, config_1.default.access_token_secret);
        if (!decoded) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized User: Invalid Authorization Token');
        }
        const { id, role } = decoded;
        // Check if the user's role is allowed
        if (requeredUserRole.length && !requeredUserRole.includes(role)) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Unauthorized User: Role not permitted');
        }
        const isUserExist = yield user_model_1.default.findById(id)
            .select('-password')
            .select('-passwordChangedAt');
        if (!isUserExist) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Unauthorized User: Forbidden Access');
        }
        if (isUserExist.isBlocked || isUserExist.isDeleted) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked');
        }
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
