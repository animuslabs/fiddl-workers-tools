import config from "../../config.json"
import { sendEmail } from "./email"
import logger from './logger'
import { bot } from './telegram'

/**
 * Sends an error message to a predefined Telegram chat using Telegraf with retry mechanism.
 * @param message - The error message to send.
 */
export async function reportErrorTelegram(message: string): Promise<void> {
    if (!config.report_telegram) {
        logger.info('Telegram reporting is disabled in the configuration.');
        return;
    }

    try {
        await bot.telegram.sendMessage(config.telegram_chat_id, message, {
            parse_mode: 'Markdown'
        });
        logger.info('Error message sent to Telegram successfully.');
    } catch (error: any) {
        logger.error('Failed to send Telegram message:', error.message || error);
    }
}
  
export async function reportErrorMail(message: string): Promise<void> {
    if (!config.report_mail) return;
    const subject = "Worker Check Error";
    await sendEmail(subject, message);
  }