import { model, Schema } from "mongoose";
import { IProcess } from "./process.interface";

const processSchema = new Schema<IProcess>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Process = model<IProcess>('Process', processSchema);