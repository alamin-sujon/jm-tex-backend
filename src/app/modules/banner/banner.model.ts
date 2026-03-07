import { model, Schema } from "mongoose";
import { IBanner } from "./banner.interface";

const bannerSchema = new Schema<IBanner>({
  title: {
    type: String
  },
  description: {
    type: String
  },
  image: {
    type: String,
    required: true
  }
}, { timestamps: true })

export const Banner = model<IBanner>('Banner', bannerSchema)