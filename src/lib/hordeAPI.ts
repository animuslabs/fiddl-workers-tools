import { 
    AIHorde, ImageTotalStats, ImageModelStats,
    HordePerformanceStable, WorkerDetailsStable,
    ModifyWorkerInput, ModifyWorker,
    UserDetails, WorkerDetails
   } from "@zeldafan0225/ai_horde";
import config from "../../config.json"
import { UserWorkersResult, ImageTotals } from "./types";
  
  const ai_horde = new AIHorde({
    cache_interval: 1000 * 10,
    cache: {
      generations_check: 1000 * 30,
    },
    client_agent: config.client_agent_name,
    api_route: config.apiUrl,
  });
  
  // check if the API is reachable
export async function checkAPIStatus(): Promise<boolean> {
    try {
      const isReachable = await ai_horde.getHeartbeat();
      if (isReachable) {
        console.log("API is reachable");
        return true;
      } else {
        // Handle the case where API responds with false
        console.log("API is not reachable");
        return false;
      }
    } catch (error) {
      console.log("API is not reachable");
      // console.error("An error occurred while checking API status:", error);
      return false;
    }
  }
  
  // check image and model totals
export async function checkImageTotals(): Promise<{ totals: ImageTotals, modelTotals: ImageModelStats } | undefined> {
    try {
      const totals = await ai_horde.getImageTotalStats() as ImageTotals;
      const modelTotals = await ai_horde.getImageModelStats();
    //   console.log("Image totals:", totals);
    //   console.log("Model totals:", modelTotals);
      return { totals, modelTotals };
    } catch (error: any) {
      console.error("An error occurred while checking image totals:", error);
      return undefined;
    }
  }
  
  // check performance 
export async function checkPerformance(): Promise<HordePerformanceStable | undefined> {
    try {
      const performance = await ai_horde.getPerformance();
      console.log("Performance:", performance);
      return performance;
    } catch (error) {
      console.error("An error occurred while checking performance:", error);
      return undefined;
    }
  }
  
  // get all workers
export async function getWorkers(): Promise<WorkerDetailsStable[] | unknown> {
    try {
      const workers = await ai_horde.getWorkers();
      // console.log("Workers:", workers);
      return workers;
    } catch (error) {
      console.error("An error occurred while getting workers:", error);
      return undefined;
    }
  }
  
  // find user by key
  async function findUserByKey(apiKey: string): Promise<UserDetails | unknown> {
    try {
      const user = await ai_horde.findUser({token: apiKey});
    //   console.log("API Key:", apiKey);
    //   console.log("User:", user);
      return user;
    } catch (error) {
      console.error("An error occurred while finding user by key:", error);
      return undefined;
    }
  }
   
  async function getUserWorkers(apiKey: string): Promise<UserWorkersResult[] | unknown> {
    try {
      const findUser = await findUserByKey(apiKey) as UserDetails;
      const userWorkers = findUser.worker_ids as string[];
      const userName = findUser.username as string;
      const workerDetails = await getWorkers() as WorkerDetailsStable[];
      const userWorkerDetails = workerDetails.filter(worker => worker.id && userWorkers.includes(worker.id));
    //   console.log("User Name:", userName, "User Worker Details:", userWorkerDetails);
      return {userName, userWorkerDetails };
    } catch (error) {
      console.error("An error occurred while getting user workers:", error);
      return undefined;
    }  
  }
  
  
export async function checkWorkerStatus(apiKey: string): Promise<{ userName: string; simplifiedWorkers: any[] } | 'no_user' | undefined> {
    try {
      const result = await getUserWorkers(apiKey);
  
      if (!result) {
        throw new Error("Failed to retrieve user workers.");
        return 'no_user';
      }
      
      const { userName, userWorkerDetails } = result as { userName: string, userWorkerDetails: WorkerDetailsStable[] };
  
      const simplifiedWorkers = userWorkerDetails.map(worker => ({
        name: worker.name || 'Unknown',
        id: worker.id || '',
        online: worker.online || false,
        maintenance_mode: worker.maintenance_mode || false,
      }));
  
      console.log("User Name:", userName)
      console.log("Simplified Workers Info:", simplifiedWorkers);
  
      return {
        userName,
        simplifiedWorkers
      };
    } catch (error) {
      console.error("An error occurred while checking worker status:", error);
      return undefined;
    }
  }

  // set worker details
  async function setWorkerDetails(workerId: string, payload:ModifyWorkerInput, apiKey:string): Promise<ModifyWorker | undefined> {
    try {
      const result = await ai_horde.updateWorker(payload, workerId, { token: apiKey });
      // console.log("Set worker details result:", result);
      return result;
    } catch (error) {
      console.error("An error occurred while setting worker details:", error);
      return undefined;
    }
  }
  