import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { processServices } from "./process.service";

const createProcess = catchAsync(async (req, res) => {
  const result = await processServices.createProcess(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Process created successfully',
    data: result
  })
})

const getAllProcess = catchAsync(async (req, res) => {
  const result = await processServices.getAllProcess()
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Processes retrived successfully',
    data: result,
  });
})
const getSingleProcess = catchAsync(async (req, res) => {
  const { processId } = req.params 
  const result = await processServices.getSingleProcess(processId)
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Process retrived successfully',
    data: result,
  });
})
const updateProcess = catchAsync(async (req, res) => {
  const { processId } = req.params 
  const result = await processServices.updateProcess(processId, req.body)
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Process updated successfully',
    data: result,
  });
})
const deleteProcess = catchAsync(async (req, res) => {
  const { processId } = req.params 
  const result = await processServices.deleteProcess(processId)
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Process deleted successfully',
    data: result,
  });
})

export const processController = {
  createProcess,
  getAllProcess,
  getSingleProcess,
  updateProcess,
  deleteProcess
}