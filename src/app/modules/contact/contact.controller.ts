// contact.controller.ts
import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { contactServices } from './contact.service';

const createContact = catchAsync(async (req, res) => {
  const result = await contactServices.createContact(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Contact created successfully',
    data: result,
  });
});

const getAllContact = catchAsync(async (req, res) => {
  const result = await contactServices.getAllContact();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Contacts retrieved successfully',
    data: result,
  });
});
const getAdminStat = catchAsync(async (req, res) => {
  const result = await contactServices.getAdminStat();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Admin data retrieved successfully',
    data: result,
  });
});

const getSingleContact = catchAsync(async (req, res) => {
  const { contactId } = req.params;
  const result = await contactServices.getSingleContact(contactId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Contact retrieved successfully',
    data: result,
  });
});

const updateContact = catchAsync(async (req, res) => {
  const { contactId } = req.params;
  const result = await contactServices.updateContact(contactId, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Contact updated successfully',
    data: result,
  });
});


const deleteContact = catchAsync(async (req, res) => {
  const { contactId } = req.params;
  const result = await contactServices.deleteContact(contactId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Contact deleted successfully',
    data: result,
  });
});
const contactUs = catchAsync(async (req, res) => {
  const result = await contactServices.contactUs(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Contact form submitted successfully',
    data: result,
  });
});
export const contactController = {
  createContact,
  getAllContact,
  getSingleContact,
  updateContact,
  deleteContact,
  contactUs,
  getAdminStat,
};
