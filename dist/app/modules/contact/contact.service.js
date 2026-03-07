"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactServices = void 0;
// contact.service.ts
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const contact_model_1 = require("./contact.model");
const sendEmail_1 = require("../../utils/sendEmail");
const banner_model_1 = require("../banner/banner.model");
const product_model_1 = require("../product/product.model");
const process_model_1 = require("../process/process.model");
const createContact = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // if you want to allow only one contact info in DB (common for websites)
    const existing = yield contact_model_1.Contact.findOne({});
    if (existing) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Contact info already exists. Please update the existing one.');
    }
    // if you want unique email check (optional)
    // const emailExist = await Contact.findOne({ email: payload.email });
    // if (emailExist) {
    //   throw new ApppError(status.BAD_REQUEST, "Email already exists");
    // }
    const result = yield contact_model_1.Contact.create(payload);
    return result;
});
const getAllContact = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contact_model_1.Contact.find({});
    return result;
});
const getSingleContact = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contact_model_1.Contact.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Contact not found');
    }
    return result;
});
const updateContact = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isContactExist = yield contact_model_1.Contact.findById(id);
    if (!isContactExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Contact not found');
    }
    const result = yield contact_model_1.Contact.findByIdAndUpdate(id, Object.assign({}, payload), { new: true });
    return result;
});
const deleteContact = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isContactExist = yield contact_model_1.Contact.findById(id);
    if (!isContactExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Contact not found');
    }
    const result = yield contact_model_1.Contact.findByIdAndDelete(id);
    return result;
});
const getAdminStat = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalBanners = yield banner_model_1.Banner.countDocuments();
    const totalProducts = yield product_model_1.CapModel.countDocuments();
    const totalProcess = yield process_model_1.Process.countDocuments();
    return {
        totalBanners,
        totalProducts,
        totalProcess
    };
});
const contactUs = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phone, email, message } = payload;
    // Basic validation
    if (!name || !email || !message) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Name, email and message are required');
    }
    const subject = `New Inquiry from ${name} via Contact Form`;
    const html = `
<div style="background-color: #f4f4f4; padding: 40px 0; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #ddd;">
    
    <div style="background-color: #3d5a6c; padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Inquiry</h1>
    </div>

    <div style="padding: 40px; color: #333; line-height: 1.6;">
      <p style="margin: 0 0 20px 0;">You have received a new contact submission from <strong>${name}</strong>.</p>
      
      <p style="margin: 0 0 20px 0;">
        <strong>Email:</strong> ${email}<br>
        <strong>Phone:</strong> ${phone || '—'}
      </p>

      <p style="margin-bottom: 30px;">Message: "${message}"</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="mailto:${email}" style="background-color: #3d5a6c; color: #ffffff; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
          Reply to ${name}
        </a>
      </div>
    </div>

    <div style="background-color: #333; padding: 20px; text-align: center; color: #fff; font-size: 12px;">
      Copyright &copy; ${new Date().getFullYear()} | Hats Master
    </div>
    
  </div>
</div>
`;
    // 3. Send the email to YOURSELF (info@hatsmaster.com)
    // We set the 'reply_to' as the customer's email
    const result = yield (0, sendEmail_1.sendEmail)('info.hatsmaster@gmail.com', subject, html, email);
    if (!result.success) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to send contact email');
    }
    return result;
});
exports.contactServices = {
    createContact,
    getAllContact,
    getSingleContact,
    updateContact,
    deleteContact,
    contactUs,
    getAdminStat,
};
