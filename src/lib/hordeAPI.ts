import axiosInstance from "./axios";
import { UserWorkersResult, StatsImgTotalsType } from "../types/types";
import { ImgModelStats, HordePerformance, WorkerDetails, UserDetails, ModifyWorkerInput, ModifyWorker } from "../types/stable_horde"
  

  // check if the API is reachable
export async function checkAPIStatus(): Promise<boolean> {
    try {
      const isReachable = await axiosInstance.get('/status/heartbeat');
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
export async function checkImageTotals(): Promise<{ totals: StatsImgTotalsType, modelTotals: ImgModelStats } | undefined> {
    try {
      const totalsResponse = await axiosInstance.get('/stats/img/totals');
      const modelTotalsResponse = await axiosInstance.get('/stats/img/models');
      const totals:StatsImgTotalsType = totalsResponse.data;
      const modelTotals:ImgModelStats = modelTotalsResponse.data;
      // console.log("Image totals:", totals);
      // console.log("Model totals:", modelTotals);
      return { totals, modelTotals };
    } catch (error: any) {
      console.error("An error occurred while checking image totals:", error);
      return undefined;
    }
  }
  
  // check performance 
export async function checkPerformance(): Promise<HordePerformance | undefined> {
    try {
      const performanceResponse = await axiosInstance.get('/status/performance');
      const performance:HordePerformance = performanceResponse.data;
      console.log("Performance:", performance);
      return performance;
    } catch (error) {
      console.error("An error occurred while checking performance:", error);
      return undefined;
    }
  }
  
  // get all workers
export async function getWorkers(): Promise<WorkerDetails[] | unknown> {
    try {
      const workersResponse = await axiosInstance.get('/workers');
      const workers:WorkerDetails[] = workersResponse.data;
      console.log("Workers:", workers);
      return workers;
    } catch (error) {
      console.error("An error occurred while getting workers:", error);
      return undefined;
    }
  }

// get worker by id
export async function getWorkerById(workerId:string): Promise<WorkerDetails | unknown> {
    try {
      const workersResponse = await axiosInstance.get(`/workers/${workerId}`);
      const worker:WorkerDetails = workersResponse.data;
      console.log("Worker:", worker);
      return worker;
    } catch (error) {
      console.error("An error occurred while getting worker info:", error);
      return undefined;
    }
  }
  
  // find user by key
async function findUserByKey(apiKey: string): Promise<UserDetails | unknown> {
    try {
      const findUserResponse = await axiosInstance.get('/find_user', { headers: { 'apikey': apiKey } });
      const user:UserDetails = findUserResponse.data;
      // console.log("API Key:", apiKey);
      // console.log("User:", user);
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
      // console.log("User Workers:", userWorkers);
      const userName = findUser.username as string;

    // Fetch worker details for each worker ID concurrently
    const workerDetailsPromises = userWorkers.map((workerId) => getWorkerById(workerId));
    const userWorkerDetails = await Promise.all(workerDetailsPromises);
      // console.log("User Name:", userName, "User Worker Details:", userWorkerDetails);
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
      
      const { userName, userWorkerDetails } = result as { userName: string, userWorkerDetails: WorkerDetails[] };
  
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
export async function setWorkerDetails(workerId: string, payload:ModifyWorkerInput, apiKey:string): Promise<ModifyWorker | undefined> {
    try {
      const resultResponse = await axiosInstance.post(`/generate/async/${workerId}`, payload, { headers: { 'apikey': apiKey } });
      const result:ModifyWorker = resultResponse.data;
      console.log("Set worker details result:", result);
      return result;
    } catch (error) {
      console.error("An error occurred while setting worker details:", error);
      return undefined;
    }
  }
