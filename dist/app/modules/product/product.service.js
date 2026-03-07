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
exports.CapService = void 0;
const mongoose_1 = require("mongoose");
const product_model_1 = require("./product.model");
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
function toBool(v) {
    if (v === undefined || v === null || v === '')
        return undefined;
    if (typeof v === 'boolean')
        return v;
    const s = String(v).toLowerCase();
    if (s === 'true')
        return true;
    if (s === 'false')
        return false;
    return undefined;
}
exports.CapService = {
    create(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const isCapExist = yield product_model_1.CapModel.exists({ name: payload.name });
            if (isCapExist) {
                throw new AppError_1.default(http_status_1.default.CONFLICT, `Cap with name '${payload.name}' already exists`);
            }
            const totalCaps = yield product_model_1.CapModel.countDocuments();
            const doc = yield product_model_1.CapModel.create(Object.assign(Object.assign({}, payload), { isActive: (_a = payload.isActive) !== null && _a !== void 0 ? _a : true, displayOrder: totalCaps + 1 }));
            return doc.toObject();
        });
    },
    findAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const page = Math.max(1, Number((_a = query.page) !== null && _a !== void 0 ? _a : 1) || 1);
            const limit = Math.min(100, Math.max(1, Number((_b = query.limit) !== null && _b !== void 0 ? _b : 10) || 10));
            const skip = (page - 1) * limit;
            const filter = {};
            const isActive = toBool(query.isActive);
            if (typeof isActive === 'boolean')
                filter.isActive = isActive;
            const q = ((_c = query.q) !== null && _c !== void 0 ? _c : '').toString().trim();
            if (q) {
                filter.$or = [
                    { name: { $regex: q, $options: 'i' } },
                    { title: { $regex: q, $options: 'i' } },
                    { description: { $regex: q, $options: 'i' } },
                ];
                // if you prefer text search:
                // filter.$text = { $search: q };
            }
            const [items, total] = yield Promise.all([
                product_model_1.CapModel.find(filter)
                    .sort({ displayOrder: 1, createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                product_model_1.CapModel.countDocuments(filter),
            ]);
            return {
                meta: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
                data: items,
            };
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.Types.ObjectId.isValid(id))
                return null;
            const result = yield product_model_1.CapModel.findById(id).lean();
            if (!result) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Cap not found');
            }
            return result;
        });
    },
    update(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.Types.ObjectId.isValid(id))
                return null;
            const isCapExist = yield product_model_1.CapModel.findById(id);
            if (!isCapExist) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Cap not found');
            }
            if (payload.displayOrder) {
                const isTargettedCapExist = yield product_model_1.CapModel.findOne({
                    displayOrder: payload === null || payload === void 0 ? void 0 : payload.displayOrder,
                });
                if (!isTargettedCapExist) {
                    throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'targetted cap not found');
                }
                const updatedTargetCap = yield product_model_1.CapModel.findByIdAndUpdate(isTargettedCapExist === null || isTargettedCapExist === void 0 ? void 0 : isTargettedCapExist.id, { displayOrder: isCapExist === null || isCapExist === void 0 ? void 0 : isCapExist.displayOrder }, { new: true });
                console.log({ updatedTargetCap, isTargettedCapExist });
            }
            const updated = yield product_model_1.CapModel.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true }).lean();
            return updated;
        });
    },
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.Types.ObjectId.isValid(id))
                return null;
            const isCapExist = yield product_model_1.CapModel.findById(id);
            console.log({ isCapExist });
            if (!isCapExist) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Cap not found');
            }
            const deleted = yield product_model_1.CapModel.findByIdAndDelete(id).lean();
            return deleted;
        });
    },
    // optional helpers
    toggleActive(id, isActive) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.update(id, { isActive });
        });
    },
    reorder(id, displayOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.update(id, { displayOrder });
        });
    },
};
