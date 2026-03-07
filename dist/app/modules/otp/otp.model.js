"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const otp_interface_1 = require("./otp.interface");
const otpSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    codeHash: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(otp_interface_1.EOtpType),
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 },
    },
    used: {
        type: Boolean,
        default: false,
    },
    attempts: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: { createdAt: true, updatedAt: false },
});
const Otp = (0, mongoose_1.model)('Otp', otpSchema);
exports.default = Otp;
