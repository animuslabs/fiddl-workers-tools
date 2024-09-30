import { WorkerDetails} from "./stable_horde"

export interface UserWorkersResult {
    userName: string;
    userWorkerDetails: WorkerDetails[];    
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

interface SinglePeriodTotals {
  images: number;
  ps: number;
}

export interface StatsImgTotalsType {
  minute?: SinglePeriodTotals;
  hour?: SinglePeriodTotals;
  day?: SinglePeriodTotals;
  month?: SinglePeriodTotals;
  total?: SinglePeriodTotals;
}