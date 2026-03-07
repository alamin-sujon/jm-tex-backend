"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const route = (0, express_1.Router)();
route.post('/login', user_controller_1.userController.login);
route.post('/change-password', (0, auth_1.default)('admin', 'user'), user_controller_1.userController.changePassword);
route.post('/forget-password', user_controller_1.userController.forgetPassword);
route.post('/verify-otp', user_controller_1.userController.otpVerified);
route.post('/reset-password', user_controller_1.userController.resetPassword);
exports.userRoute = route;
