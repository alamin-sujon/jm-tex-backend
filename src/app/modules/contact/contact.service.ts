// contact.service.ts
import status from 'http-status';
import ApppError from '../../error/AppError';
import { Contact } from './contact.model';
import { IContact } from './contact.interface';
import { sendEmail } from '../../utils/sendEmail';
import { Banner } from '../banner/banner.model';
import { CapModel } from '../product/product.model';
import { Process } from '../process/process.model';

const createContact = async (payload: IContact) => {
  // if you want to allow only one contact info in DB (common for websites)
  const existing = await Contact.findOne({});
  if (existing) {
    throw new ApppError(
      status.BAD_REQUEST,
      'Contact info already exists. Please update the existing one.',
    );
  }

  // if you want unique email check (optional)
  // const emailExist = await Contact.findOne({ email: payload.email });
  // if (emailExist) {
  //   throw new ApppError(status.BAD_REQUEST, "Email already exists");
  // }

  const result = await Contact.create(payload);
  return result;
};

const getAllContact = async () => {
  const result = await Contact.find({});
  return result;
};

const getSingleContact = async (id: string) => {
  const result = await Contact.findById(id);
  if (!result) {
    throw new ApppError(status.NOT_FOUND, 'Contact not found');
  }
  return result;
};

const updateContact = async (id: string, payload: Partial<IContact>) => {
  const isContactExist = await Contact.findById(id);
  if (!isContactExist) {
    throw new ApppError(status.NOT_FOUND, 'Contact not found');
  }

  const result = await Contact.findByIdAndUpdate(
    id,
    { ...payload },
    { new: true },
  );
  return result;
};

const deleteContact = async (id: string) => {
  const isContactExist = await Contact.findById(id);
  if (!isContactExist) {
    throw new ApppError(status.NOT_FOUND, 'Contact not found');
  }

  const result = await Contact.findByIdAndDelete(id);
  return result;
};

const getAdminStat = async () => {
  const totalBanners = await Banner.countDocuments();
  const totalProducts = await CapModel.countDocuments();
  const totalProcess = await Process.countDocuments()
  return {
    totalBanners,
    totalProducts,
    totalProcess
  }
  
}


const contactUs = async (payload: {
  name: string;
  phone: string;
  email: string;
  message: string;
}) => {
  const { name, phone, email, message } = payload;

  // Basic validation
  if (!name || !email || !message) {
    throw new ApppError(
      status.BAD_REQUEST,
      'Name, email and message are required',
    );
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
  const result = await sendEmail(
    'info.hatsmaster@gmail.com',
    subject,
    html,
    email, // Pass the user's email as the reply-to address
  );

  if (!result.success) {
    throw new ApppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to send contact email',
    );
  }

  return result;
};

export const contactServices = {
  createContact,
  getAllContact,
  getSingleContact,
  updateContact,
  deleteContact,
  contactUs,
  getAdminStat,
};
