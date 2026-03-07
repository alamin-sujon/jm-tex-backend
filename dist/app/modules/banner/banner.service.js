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
exports.bannerServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const banner_model_1 = require("./banner.model");
const createBanner = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield banner_model_1.Banner.create(payload);
    return result;
});
const getAllBanner = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield banner_model_1.Banner.find({});
    return result;
});
const getSingleBanner = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield banner_model_1.Banner.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Banner not found');
    }
    return result;
});
const updateBanner = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isBannerExist = yield banner_model_1.Banner.findById(id);
    if (!isBannerExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Banner not found');
    }
    const result = yield banner_model_1.Banner.findByIdAndUpdate(id, Object.assign({}, payload), { new: true });
    return result;
});
const deleteBanner = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isBannerExist = yield banner_model_1.Banner.findById(id);
    if (!isBannerExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Banner not found');
    }
    const result = yield banner_model_1.Banner.findByIdAndDelete(id);
    return result;
});
exports.bannerServices = {
    createBanner,
    getAllBanner,
    getSingleBanner,
    updateBanner,
    deleteBanner
};
