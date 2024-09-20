import { 
    AIHorde, ImageTotalStats, ImageModelStats,
    HordePerformanceStable, WorkerDetailsStable,
    ModifyWorkerInput, ModifyWorker,
    UserDetails, WorkerDetails
   } from "@zeldafan0225/ai_horde";

export interface UserWorkersResult {
    userName: string;
    userWorkerDetails: WorkerDetailsStable[];    
  }

  interface TimePeriodData {
    images: number;
    ps: number;
  }

// it looks like the aihorde library has a wrong type definition for ImageTotalStats thats why we need to create our own type
export interface ImageTotals {
    minute: TimePeriodData;
    hour: TimePeriodData;
    day: TimePeriodData;
    month: TimePeriodData;
    total: TimePeriodData;
  }
  

  interface SimplifiedWorker {
    name: string;
    id: string;
    online: boolean;
    maintenance_mode: boolean;
  }
  
  // Define the structure returned by checkWorkerStatus
export interface WorkerStatus {
    userName: string;
    simplifiedWorkers: SimplifiedWorker[];
  }