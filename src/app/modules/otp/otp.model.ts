import { model, Schema } from "mongoose";
import { EOtpType, IOtp } from "./otp.interface";

const otpSchema = new Schema<IOtp>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    codeHash: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(EOtpType),
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
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const Otp = model<IOtp>('Otp', otpSchema);

export default Otp
