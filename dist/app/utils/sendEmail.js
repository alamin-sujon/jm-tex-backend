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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
// const resend = new Resend(config.resend_key);
// export const sendEmail = async (to: string, subject: string, html: string, replyTo?: string) => {
//   console.log({to, replyTo})
//   try {
//     const { data, error } = await resend.emails.send({
//       from: 'Hats Master <info.hatsmaster@gmail.com>',
//       to: [to],
//       subject: subject,
//       html: html,
//       ...(replyTo && { reply_to: replyTo.trim() }),
//     });
//     if (error) {
//       console.error({ error });
//       return { success: false };
//     }
//     console.log({ data }); // data.id is your confirmation
//     return { success: true, messageId: data?.id };
//   } catch (err) {
//     console.error('Resend Error:', err);
//     return { success: false };
//   }
// };
const sendEmail = (to, subject, html, replyTo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com', // or config.smtp_host
            // host: 'mail.hatsmaster.com', // or config.smtp_host
            port: 465, // or Number(config.smtp_port)
            secure: true, // ✅ MUST be true for 465 (SSL/TLS)
            auth: {
                user: config_1.default.smtp_user, // or config.smtp_user
                pass: config_1.default.smtp_password,
            },
            // optional: keep this OFF unless you really need it
            // tls: { rejectUnauthorized: false },
        });
        // optional but helpful for debugging:
        // await transporter.verify();
        const info = yield transporter.sendMail(Object.assign(Object.assign({ from: `"Hats Master" <info.hatsmaster@gmail.com>`, // ✅ must be the authenticated mailbox
            to, // admin/receiver
            subject,
            html }, (replyTo ? { replyTo } : {})), (replyTo ? { sender: replyTo } : {})));
        console.log({ info });
        return { success: true, messageId: info.messageId };
    }
    catch (err) {
        console.error('❌ Email sending failed:', err);
        return { success: false, error: 'Failed to send email' };
    }
});
exports.sendEmail = sendEmail;
