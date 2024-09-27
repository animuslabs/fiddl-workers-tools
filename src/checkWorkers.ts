import { ModifyWorkerInput } from "@zeldafan0225/ai_horde";
import { checkWorkerStatus, setWorkerDetails } from './lib/hordeAPI';
import config from "../config.json"
import { WorkerStatus } from './types/types';
import { reportErrorTelegram, reportErrorMail } from './lib/report';
import { millisecondsToMinutes } from './lib/helperFunctions';

async function checkWorkers(): Promise<void> {
    try {
      // Retrieve the worker status
      const workersResult = await checkWorkerStatus(config.workerKey);
  
      // Handle cases where no user is found or the result is undefined
      if (workersResult === 'no_user' || workersResult === undefined) {
        throw new Error('No user found or unable to retrieve worker status.');
      }
  
      const { userName, simplifiedWorkers } = workersResult as WorkerStatus;
  
      console.log(`Checking workers for user: ${userName}`);
  
      // Iterate through each worker to perform checks
      for (const worker of simplifiedWorkers) {
        const { name, id, online, maintenance_mode } = worker;
  
        // Check if the worker is offline
        if (!online) {
          const errorMessage = `Worker "${name}" (ID: ${id}) is offline.`;
          console.error(errorMessage);
          await reportErrorTelegram(errorMessage);
          await reportErrorMail(errorMessage);
          continue
        }
  
        // If the worker is in maintenance mode, attempt to disable it
        if (maintenance_mode) {
          console.log(`Worker "${name}" is in maintenance mode. Attempting to disable maintenance mode.`);
  
          // Prepare the payload to disable maintenance mode
          const payload: ModifyWorkerInput = { maintenance: false };
  
          // Attempt to update the worker's maintenance mode
          const updatedWorker = await setWorkerDetails(id, payload, config.workerKey);
  
          // Handle cases where updating the worker details fails
          if (!updatedWorker) {
            const errorMessage = `Failed to update maintenance mode for worker "${name}" (ID: ${id}).`;
            console.error(errorMessage);
            await reportErrorTelegram(errorMessage);
            await reportErrorMail(errorMessage);
            continue;
          }
  
          console.log(`Successfully disabled maintenance mode for worker "${name}" (ID: ${id}).`);
        }
      }
  
      console.log('All workers are online and not in maintenance mode.');
  
    } catch (error:any) {
        console.error("An error occurred while checking workers:", error.message || error);

        // Report the error via Telegram and/or Email based on config
        const errorMessage = `Worker Check Error: ${error.message || error}`;
        await reportErrorTelegram(errorMessage);
        await reportErrorMail(errorMessage);
        throw error; // Re-throw the error if further handling is needed upstream
    }
  }
  
// Function to initialize worker checking based on configuration
export function initializeWorkerCheck() {
    if (config.check_workers) {
      console.log('Worker checking is enabled.');
  
      // Immediately run the checkWorkers function
      checkWorkers();
  
      // Set up periodic execution based on check_workers_interval
      const interval = config.check_workers_interval;
  
      if (typeof interval === 'number' && interval > 0) {
        setInterval(() => {
          checkWorkers().catch(error => {
            // This catch is to ensure that any unhandled promise rejections are caught
            console.error('Unhandled error in scheduled checkWorkers:', error);
          });
        }, interval);
        const intervalInMinutes = millisecondsToMinutes(interval);
        console.log(`Worker checking scheduled every ${intervalInMinutes} minutes.`);
      } else {
        console.warn('Invalid check_workers_interval in config. Skipping scheduled checks.');
      }
    } else {
      console.log('Worker checking is disabled in the configuration.');
    }
  }
