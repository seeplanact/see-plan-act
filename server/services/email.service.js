import nodemailer from 'nodemailer';
import { logger } from '../configs/logger.config.js';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

// Send contact form notification to admin
export const sendContactNotification = async ({ name, email, subject, message }) => {
  const transporter = createTransporter();

  const adminMail = {
    from: `"SeePlanAct Contact" <${process.env.SMTP_EMAIL}>`,
    to: process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL,
    subject: `[Contact] ${subject}`,
    html: `
      <div style="font-family: monospace; background: #0a0a0a; color: #fff; padding: 32px; border-radius: 8px; max-width: 560px;">
        <h2 style="color: #00f5c4; margin: 0 0 24px; font-size: 18px; letter-spacing: 2px; text-transform: uppercase;">
          New Contact Form Submission
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #666; padding: 8px 0; width: 80px; vertical-align: top; font-size: 12px;">FROM</td>
            <td style="color: #fff; padding: 8px 0; font-size: 14px;">${name}</td>
          </tr>
          <tr>
            <td style="color: #666; padding: 8px 0; font-size: 12px;">EMAIL</td>
            <td style="padding: 8px 0;">
              <a href="mailto:${email}" style="color: #00f5c4; font-size: 14px;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="color: #666; padding: 8px 0; font-size: 12px;">SUBJECT</td>
            <td style="color: #fff; padding: 8px 0; font-size: 14px;">${subject}</td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding: 16px; background: #111; border-left: 2px solid #00f5c4; border-radius: 4px;">
          <p style="color: #999; font-size: 11px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
          <p style="color: #ddd; font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="color: #333; font-size: 11px; margin-top: 32px;">
          Received at ${new Date().toUTCString()} · SeePlanAct
        </p>
      </div>
    `,
  };

  // Auto-reply to sender
  const replyMail = {
    from: `"SeePlanAct" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: `We received your message — SeePlanAct`,
    html: `
      <div style="font-family: monospace; background: #0a0a0a; color: #fff; padding: 32px; border-radius: 8px; max-width: 560px;">
        <h2 style="color: #00f5c4; margin: 0 0 8px; font-size: 20px; letter-spacing: 3px;">
          SEEPLANACT
        </h2>
        <p style="color: #666; font-size: 11px; margin: 0 0 32px; text-transform: uppercase; letter-spacing: 1px;">
          Robots that see, plan, and act.
        </p>
        <p style="color: #ddd; font-size: 14px; line-height: 1.8; margin: 0 0 16px;">
          Hi ${name},
        </p>
        <p style="color: #ddd; font-size: 14px; line-height: 1.8; margin: 0 0 16px;">
          Thank you for reaching out. We've received your message and will get back to you as soon as possible.
        </p>
        <div style="margin: 24px 0; padding: 16px; background: #111; border-left: 2px solid #1a1a1a; border-radius: 4px;">
          <p style="color: #666; font-size: 11px; margin: 0 0 6px; text-transform: uppercase;">Your message</p>
          <p style="color: #888; font-size: 13px; line-height: 1.7; margin: 0;">${message.substring(0, 200)}${message.length > 200 ? '...' : ''}</p>
        </div>
        <p style="color: #ddd; font-size: 14px; line-height: 1.8; margin: 0;">
          — The SeePlanAct Team
        </p>
        <hr style="border: none; border-top: 1px solid #1a1a1a; margin: 32px 0;" />
        <p style="color: #333; font-size: 11px; margin: 0;">
          © ${new Date().getFullYear()} SeePlanAct. You're receiving this because you contacted us.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(adminMail);
    await transporter.sendMail(replyMail);
    logger.info(`Contact email sent from ${email}`);
  } catch (err) {
    logger.error(`Email send error: ${err.message}`);
    throw err;
  }
};