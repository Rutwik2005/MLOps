export interface Experiment {
  id: number;
  name?: string;
  experiment_name?: string;
  dataset_id?: number;
  algorithm?: string;
  accuracy?: number;
  run_id?: string;
  created_at?: string;
}

export interface RegisteredModel {
  id: number;
  name: string;
  experiment_id: number;
  version?: string;
  status?: string;
}

export interface ModelRegisterRequest {
  name: string;
  experiment_id: number;
}
