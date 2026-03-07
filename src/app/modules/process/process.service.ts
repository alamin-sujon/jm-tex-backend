import status from "http-status";
import ApppError from "../../error/AppError";
import { Process } from "./process.model";
import { IProcess } from "./process.interface";

const createProcess = async (payload: IProcess) => {
  console.log({payload})
  const isProcessExist = await Process.findOne({ title: payload.title })
  if (isProcessExist) {
    throw new ApppError(status.BAD_REQUEST, 'Process title already exist')
  }
  const result = await Process.create(payload)
  return result
}

const getAllProcess = async () => {
  const result = await Process.find({})
  return result
}

const getSingleProcess = async (id: string) => {
  const result = await Process.findById(id)
  if (!result) {
    throw new ApppError(status.NOT_FOUND, 'Process not found');
  }
    
  return result
}
const updateProcess = async (id: string, payload: Partial<IProcess>) => {
  const isProcessExist = await Process.findById(id)
  if (!isProcessExist) {
    throw new ApppError(status.NOT_FOUND, 'Banner not found');
  }
  const result = await Process.findByIdAndUpdate(id, {...payload}, {new: true})
    
  return result
}
const deleteProcess = async (id: string) => {
const isProcessExist = await Process.findById(id);
if (!isProcessExist) {
  throw new ApppError(status.NOT_FOUND, 'Banner not found');
}
  const result = await Process.findByIdAndDelete(id)  
  return result
}

export const processServices = {
  createProcess,
  getAllProcess,
  getSingleProcess,
  updateProcess,
  deleteProcess
}