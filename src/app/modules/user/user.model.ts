import { model, Schema } from "mongoose";
import {  IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, 
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    profileImage: {
      type: String,
      default: '',
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true, 
  },
);

const User = model<IUser>('User', userSchema);

export default User;
