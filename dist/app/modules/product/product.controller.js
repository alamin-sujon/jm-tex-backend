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
exports.CapController = void 0;
const product_service_1 = require("./product.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const create = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.CapService.create(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Products created successfully',
        data: result
    });
}));
const findMany = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.CapService.findAll(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Products retrived successfully',
        data: result === null || result === void 0 ? void 0 : result.data,
        meta: result === null || result === void 0 ? void 0 : result.meta
    });
}));
const findById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const result = yield product_service_1.CapService.findById(productId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product retrived successfully',
        data: result
    });
}));
const update = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const result = yield product_service_1.CapService.update(productId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product updated successfully',
        data: result
    });
}));
const remove = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const result = yield product_service_1.CapService.remove(productId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product deleted successfully',
        data: result
    });
}));
// optional
function toggleActive(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { isActive } = req.body;
            const updated = yield product_service_1.CapService.toggleActive(req.params.id, Boolean(isActive));
            if (!updated)
                return res
                    .status(404)
                    .json({ success: false, message: 'Cap not found' });
            res.json({ success: true, data: updated });
        }
        catch (err) {
            next(err);
        }
    });
}
function reorder(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { displayOrder } = req.body;
            const updated = yield product_service_1.CapService.reorder(req.params.id, Number(displayOrder));
            if (!updated)
                return res
                    .status(404)
                    .json({ success: false, message: 'Cap not found' });
            res.json({ success: true, data: updated });
        }
        catch (err) {
            next(err);
        }
    });
}
exports.CapController = {
    create,
    findMany,
    findById,
    update,
    remove
};
