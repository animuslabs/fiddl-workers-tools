import { Telegraf, Markup } from 'telegraf';
import config from "../../config.json"
export const bot = new Telegraf(config.telegram_bot_token)
import { checkPerformance, checkImageTotals, checkWorkerStatus, getWorkers, getWorkerById } from './hordeAPI';
import { WorkerDetailsStable } from "@zeldafan0225/ai_horde";
import { formatUptime } from './helperFunctions';

// Define the button menu
const buttonMenu = Markup.inlineKeyboard([
    [
      Markup.button.callback('Performance', 'performance'),
      Markup.button.callback('Image Totals', 'imagetotals'),
    ],
    [
      Markup.button.callback('Workers Status', 'workerstatus'),
      Markup.button.callback('Worker Details', 'workerdetails'),
    ],
  ]);

// Map to keep track of users expecting to enter their API key or worker ID
const waitingForApiKey = new Map<number, boolean>();
const waitingForWorkerId = new Map<number, boolean>();

bot.start((ctx) => {
    ctx.reply('Choose wisely!', buttonMenu);
});

bot.action('buttonback', (ctx) => {
    ctx.reply('Hello Again! Please choose an option:', buttonMenu);
    });

bot.action('performance', async (ctx) => {
    const performance = await checkPerformance();
    if (performance) {
      ctx.reply(
`
<b>Horde Performance</b>

Queued Requests: ${performance.queued_requests ?? 'N/A'}
Worker Count: ${performance.worker_count ?? 'N/A'}
Thread Count: ${performance.thread_count ?? 'N/A'}
Queued Megapixelsteps: ${performance.queued_megapixelsteps ?? 'N/A'}
Past Minute Megapixelsteps: ${performance.past_minute_megapixelsteps ?? 'N/A'}
Queued Forms: ${performance.queued_forms ?? 'N/A'}
Interrogator Count: ${performance.interrogator_count ?? 'N/A'}
Interrogator Thread Count: ${performance.interrogator_thread_count ?? 'N/A'}
`, { parse_mode: 'HTML', reply_markup: { inline_keyboard: [ [ { text: 'Go back', callback_data: 'buttonback'} ]] } })
    } else {
      ctx.reply('An error occurred while checking performance.');
    }
  });

bot.action('imagetotals', async (ctx) => {
    const totals = await checkImageTotals();
    const imageTotals = totals?.totals;
    console.log(imageTotals);
    if (imageTotals) {
      ctx.reply(
`
<b>Image Totals</b>
<b>Minute:</b>
- Images: ${imageTotals.minute?.images ?? 'N/A'}
- Credits: ${imageTotals.minute?.ps?.toLocaleString() ?? 'N/A'}

<b>Hour:</b>
- Images: ${imageTotals.hour?.images ?? 'N/A'}
- Credits: ${imageTotals.hour?.ps?.toLocaleString() ?? 'N/A'}

<b>Day:</b>
- Images: ${imageTotals.day?.images ?? 'N/A'}
- Credits: ${imageTotals.day?.ps?.toLocaleString() ?? 'N/A'}

<b>Month:</b>
- Images: ${imageTotals.month?.images ?? 'N/A'}
- Credits: ${imageTotals.month?.ps?.toLocaleString() ?? 'N/A'}

<b>Total:</b>
- Images: ${imageTotals.total?.images ?? 'N/A'}
- Credits: ${imageTotals.total?.ps?.toLocaleString() ?? 'N/A'}
`, { parse_mode: 'HTML', reply_markup: { inline_keyboard: [ [ { text: 'Go back', callback_data: 'buttonback'} ]] } })
    }
    else {
      ctx.reply('An error occurred while checking image totals.');
    }
    });


bot.action('workerstatus', async (ctx) => {
    // Ask the user to enter their API key
    await ctx.reply('Please enter your API key. We do not store your API key anywhere.');
    // Add the user ID to the Map to indicate we're expecting their API key
    waitingForApiKey.set(ctx.from.id, true);
    });

bot.action('workerdetails', async (ctx) => {
    // Ask the user to enter the worker ID
    await ctx.reply('Please enter the ID of the worker:');
    // Add the user ID to the Map to indicate we're expecting their worker ID
    waitingForWorkerId.set(ctx.from.id, true);
  });      

// Handle text messages
  bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
  
    if (waitingForApiKey.has(userId)) {
      // We're waiting for this user's API key
      // Remove the user from the Map
      waitingForApiKey.delete(userId);
      // Get the API key from the user's message
      const apikey = ctx.message.text.trim();
  
      // Call checkWorkerStatus with the API key
      try {
        const result = await checkWorkerStatus(apikey);
        if (result === 'no_user') {
          // No user found
          ctx.reply('No user found with the provided API key.', {
            reply_markup: {
              inline_keyboard: [[{ text: 'Go back', callback_data: 'buttonback' }]],
            },
          });
        } else if (result) {
          const { userName, simplifiedWorkers } = result;
  
          if (simplifiedWorkers.length > 0) {
            // User has workers, display the worker status
            let message = `<b>User:</b> ${userName}\n\n`;
            message += '<b>Worker User Status:</b>\n\n';
            simplifiedWorkers.forEach((worker) => {
              message += `<b>Name:</b> ${worker.name}\n`;
              message += `<b>ID:</b> <code>${worker.id}\n</code>`;
              message += `<b>Online:</b> ${worker.online}\n`;
              message += `<b>Maintenance Mode:</b> ${worker.maintenance_mode}\n`;
            });
            ctx.reply(message, {
              parse_mode: 'HTML',
              reply_markup: {
                inline_keyboard: [[{ text: 'Go back', callback_data: 'buttonback' }]],
              },
            });
          } else {
            // User has no workers
            ctx.reply(`User <b>${userName}</b> has no workers.`, {
              parse_mode: 'HTML',
              reply_markup: {
                inline_keyboard: [[{ text: 'Go back', callback_data: 'buttonback' }]],
              },
            });
          }
        } else {
          // An error occurred
          ctx.reply('An error occurred while checking worker status.', {
            reply_markup: {
              inline_keyboard: [[{ text: 'Go back', callback_data: 'buttonback' }]],
            },
          });
        }
      } catch (error) {
        console.error('An error occurred while checking worker status:', error);
        ctx.reply('An error occurred while checking worker status.', {
          reply_markup: {
            inline_keyboard: [[{ text: 'Go back', callback_data: 'buttonback' }]],
          },
        });
      }
    } else if (waitingForWorkerId.has(userId)) {
      // We're waiting for the worker ID
      // Remove the user from the Map
      waitingForWorkerId.delete(userId);
      // Get the worker ID from the user's message
      const workerId = ctx.message.text.trim();
      console.log('User provided worker ID:', workerId);
  
      try {
        const worker = await getWorkerById(workerId) as WorkerDetailsStable;
  
        if (worker) {
            const uptimeFormatted = worker.uptime ? formatUptime(worker.uptime) : 'N/A';
          // Worker found, display detailed information
          let message = `<b>Worker Details:</b>\n\n`;
          message += `<b>Name:</b> ${worker.name ?? 'N/A'}\n`;
          message += `<b>ID:</b> ${worker.id ?? 'N/A'}\n`;
          message += `<b>Online:</b> ${worker.online ?? 'N/A'}\n`;
          message += `<b>Requests Fulfilled:</b> ${worker.requests_fulfilled?.toLocaleString() ?? 'N/A'}\n`;
          message += `<b>Kudos Rewards:</b> ${worker.kudos_rewards?.toLocaleString() ?? 'N/A'}\n`;
          message += `<b>Performance:</b> ${worker.performance ?? 'N/A'}\n`;
          message += `<b>Threads:</b> ${worker.threads ?? 'N/A'}\n`;
          message += `<b>Uptime:</b> ${uptimeFormatted}\n`;
          message += `<b>Maintenance Mode:</b> ${worker.maintenance_mode ?? 'N/A'}\n`;
          message += `<b>NSFW:</b> ${worker.nsfw ?? 'N/A'}\n`;
          message += `<b>Trusted:</b> ${worker.trusted ?? 'N/A'}\n`;
          message += `<b>Uncompleted Jobs:</b> ${worker.uncompleted_jobs ?? 'N/A'}\n`;
          message += `<b>Models:</b> ${worker.models?.join(', ') ?? 'N/A'}\n`;
          message += `<b>Bridge Agent:</b> <code>${worker.bridge_agent ?? 'N/A'}\n</code>`;

          ctx.reply(message, {
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: [[{ text: 'Go back', callback_data: 'buttonback' }]],
            },
          });
        } else {
          // Worker not found
          ctx.reply('No worker found with the provided ID.', {
            reply_markup: {
              inline_keyboard: [[{ text: 'Go back', callback_data: 'buttonback' }]],
            },
          });
        }
      } catch (error) {
        console.error('An error occurred while fetching worker details:', error);
        ctx.reply('An error occurred while fetching worker details.', {
          reply_markup: {
            inline_keyboard: [[{ text: 'Go back', callback_data: 'buttonback' }]],
          },
        });
      }
    } else {
      // Handle other text messages or guide the user
      ctx.reply('Please use the menu to interact with the bot.', {
        reply_markup: buttonMenu.reply_markup,
      });
    }
  });
  