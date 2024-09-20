import config from "../../config.json"

// Placeholder functions for error reporting (to be implemented later)
export async function reportErrorTelegram(message: string): Promise<void> {
    if (config.report_telegram) {
      // Implement Telegram reporting logic here using config.telegram_bot_token
      console.log(`Telegram Error Report: ${message}`);
      // Example: Use a Telegram bot API to send the message
    }
  }
  
export async function reportErrorMail(message: string): Promise<void> {
    if (config.report_mail) {
      // Implement Email reporting logic here using config.email
      console.log(`Email Error Report: ${message}`);
      // Example: Use nodemailer or another email library to send the message
    }
  }