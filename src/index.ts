import { bot } from './lib/telegram';
import { initializeWorkerCheck } from './checkWorkers';

bot.launch(); // launch telegram bot
console.log('Bot is running!');

// Initialize worker checking based on configuration
initializeWorkerCheck();