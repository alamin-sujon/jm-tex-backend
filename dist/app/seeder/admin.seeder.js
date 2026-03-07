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
exports.adminSeeder = void 0;
const config_1 = __importDefault(require("../config"));
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const hashPassword_1 = require("../utils/hashPassword");
const adminSeeder = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingAdmin = yield user_model_1.default.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('⚠️ Admin already exists, skipping seeding.');
            return;
        }
        const hashedPassword = yield hashPassword_1.passwordUtils.hashPassword(config_1.default.admin_password);
        const adminData = {
            name: 'Alamin Sujon',
            email: config_1.default.admin_email,
            phone: '+8801000000000',
            password: hashedPassword,
            role: 'admin',
        };
        const admin = yield user_model_1.default.create(adminData);
        console.log({ admin });
        console.log('✅ Admin seeded successfully!');
    }
    catch (error) {
        console.error('❌ Failed to seed admin:', error);
    }
});
exports.adminSeeder = adminSeeder;
