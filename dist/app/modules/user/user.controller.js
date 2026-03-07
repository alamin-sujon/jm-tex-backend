"use strict";
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
exports.userController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const login = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.uerService.login(req.body);
    (0, sendResponse_1.default)(res, {
        message: 'login successfull',
        success: true,
        data: result,
        statusCode: http_status_1.default.OK
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req === null || req === void 0 ? void 0 : req.user;
    console.log({ user });
    const result = yield user_service_1.uerService.changePassword(req.body, user === null || user === void 0 ? void 0 : user.email);
    (0, sendResponse_1.default)(res, {
        message: 'Password changed successfull',
        success: true,
        data: result,
        statusCode: http_status_1.default.OK
    });
}));
const forgetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.uerService.forgotPassword(req.body);
    (0, sendResponse_1.default)(res, {
        message: 'Please check you email',
        success: true,
        data: result,
        statusCode: http_status_1.default.OK
    });
}));
const otpVerified = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const result = yield user_service_1.uerService.verifyOtp(email, otp);
    (0, sendResponse_1.default)(res, {
        message: 'Otp verified successfull',
        success: true,
        data: result,
        statusCode: http_status_1.default.OK
    });
}));
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.uerService.resetPassword(req.body);
    (0, sendResponse_1.default)(res, {
        message: 'login successfull',
        success: true,
        data: result,
        statusCode: http_status_1.default.OK
    });
}));
exports.userController = {
    login,
    changePassword,
    forgetPassword,
    otpVerified,
    resetPassword
};
