"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapModel = void 0;
const mongoose_1 = require("mongoose");
const CapFeatureSchema = new mongoose_1.Schema({
    heading: { type: String, required: true, trim: true, maxlength: 80 },
    content: { type: String, required: true, trim: true, maxlength: 300 },
}, { _id: false });
const CapSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80,
        index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    image1: { type: String, trim: true },
    image2: { type: String, trim: true },
    description: { type: String, required: true, trim: true, maxlength: 400 },
    description2: { type: String },
    features: { type: [CapFeatureSchema], default: [] },
    featuresDetails: { type: String },
    isActive: { type: Boolean, default: true, index: true },
    displayOrder: { type: Number, default: 0, index: true },
}, { timestamps: true, collection: 'caps' });
// useful indexes
CapSchema.index({ isActive: 1, displayOrder: 1, createdAt: -1 });
CapSchema.index({ name: 'text', title: 'text', description: 'text' });
exports.CapModel = (0, mongoose_1.model)('Cap', CapSchema);
