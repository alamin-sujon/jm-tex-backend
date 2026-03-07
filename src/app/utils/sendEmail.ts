import nodemailer from 'nodemailer';
import config from '../config';
import { Resend } from 'resend';
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


export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  replyTo?: string,
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // or config.smtp_host
      // host: 'mail.hatsmaster.com', // or config.smtp_host
      port: 465, // or Number(config.smtp_port)
      secure: true, // ✅ MUST be true for 465 (SSL/TLS)
      auth: {
        user: config.smtp_user, // or config.smtp_user
        pass: config.smtp_password,
      },
      // optional: keep this OFF unless you really need it
      // tls: { rejectUnauthorized: false },
    });

    // optional but helpful for debugging:
    // await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Hats Master" <info.hatsmaster@gmail.com>`, // ✅ must be the authenticated mailbox
      to, // admin/receiver
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
      // optional: helps some clients show who initiated it
      ...(replyTo ? { sender: replyTo } : {}),
    });

    console.log({info})

    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('❌ Email sending failed:', err);
    return { success: false, error: 'Failed to send email' };
  }
};
