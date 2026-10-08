export interface TrainingJob {
  id?: number;
  dataset_id: number | string;
  algorithm: string;
  target_column: string;
  status?: string;
  accuracy?: number;
  run_id?: string;
  created_at?: string;
}

export interface TrainingRequest {
  dataset_id: number;
  target_column: string;
  algorithm: string;
}

export interface TrainingResponse {
  success: boolean;
  job?: TrainingJob;
  experiment?: any;
}
