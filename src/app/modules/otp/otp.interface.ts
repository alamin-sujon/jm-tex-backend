import { Types } from "mongoose";

export enum EOtpType {
  VERIFICATION = 'VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
  TWO_FACTOR = 'TWO_FACTOR',
}

export interface IOtp {
  userId: Types.ObjectId;
  codeHash: string;
  type: EOtpType;
  expiresAt: Date;
  used: boolean;
  attempts: number;
  createdAt: Date;
}
