import { model, Schema } from "mongoose";
import { IContact } from "./contact.interface";

const contactSchema = new Schema<IContact>({
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
}, { timestamps: true })

export const Contact = model<IContact>('Contact', contactSchema)