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
exports.processServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const process_model_1 = require("./process.model");
const createProcess = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ payload });
    const isProcessExist = yield process_model_1.Process.findOne({ title: payload.title });
    if (isProcessExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Process title already exist');
    }
    const result = yield process_model_1.Process.create(payload);
    return result;
});
const getAllProcess = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield process_model_1.Process.find({});
    return result;
});
const getSingleProcess = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield process_model_1.Process.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Process not found');
    }
    return result;
});
const updateProcess = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isProcessExist = yield process_model_1.Process.findById(id);
    if (!isProcessExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Banner not found');
    }
    const result = yield process_model_1.Process.findByIdAndUpdate(id, Object.assign({}, payload), { new: true });
    return result;
});
const deleteProcess = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isProcessExist = yield process_model_1.Process.findById(id);
    if (!isProcessExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Banner not found');
    }
    const result = yield process_model_1.Process.findByIdAndDelete(id);
    return result;
});
exports.processServices = {
    createProcess,
    getAllProcess,
    getSingleProcess,
    updateProcess,
    deleteProcess
};
