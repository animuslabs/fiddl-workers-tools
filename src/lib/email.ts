import nodemailer from 'nodemailer';
import config from "../../config.json";
import logger from './logger';

/**
 * Creates a Nodemailer transporter using SMTP settings from the configuration.
 */
function createTransporter() {
    const { host, port, secure, auth, service, service_active } = config.smtp;
  
    if (!service_active) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth,
        logger: true,
      });
      return transporter;
    } else {
      const transporter = nodemailer.createTransport({
        service,
        auth,
        logger: true,
      });
      return transporter;
    }
  }
  
  /**
   * Sends an email with the given subject and message.
   * @param subject - The subject of the email.
   * @param message - The plain text message of the email.
   * @param htmlMessage - (Optional) The HTML version of the email content.
   */
export async function sendEmail(subject: string, message: string, htmlMessage?: string): Promise<void> {
    try {
      const transporter = createTransporter();
  
      const mailOptions: nodemailer.SendMailOptions = {
        from: `"Boid Bot" <${config.smtp.auth.user}>`, // sender address
        to: config.reply_email, // list of receivers
        subject, // Subject line
        text: message, // plain text body
        html: htmlMessage || message, // html body
      };
  
      const info = await transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.messageId}`);
    } catch (error: any) {
      logger.error("Failed to send email:", error.message || error);
    }
  }