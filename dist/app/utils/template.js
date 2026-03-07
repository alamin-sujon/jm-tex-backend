"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactUsTemplate = void 0;
const contactUsTemplate = (name, email, phone, message) => {
    return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 0;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background-color: #000000; padding: 20px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0;">New Contact Message</h2>
      </div>

      <!-- Body -->
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333;">
          You have received a new message from your website contact form.
        </p>

        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="font-weight: bold; width: 120px;">Name:</td>
            <td>${name}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Email:</td>
            <td>${email}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Phone:</td>
            <td>${phone || 'N/A'}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; vertical-align: top;">Message:</td>
            <td style="white-space: pre-line;">${message}</td>
          </tr>
        </table>

        <p style="margin-top: 30px; font-size: 14px; color: #777;">
          This email was automatically generated from the Hats Master website contact form.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 13px; color: #666;">
        © ${new Date().getFullYear()} Hats Master. All rights reserved.
      </div>

    </div>
  </div>
  `;
};
exports.contactUsTemplate = contactUsTemplate;
