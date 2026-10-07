export interface FeatureSchema {
  name: string;
  type: 'categorical' | 'number' | 'boolean' | 'string' | string;
  required?: boolean;
  options?: any[];
}

export interface Deployment {
  id?: number;
  name: string;
  deployment_name?: string;
  model_id: number | string;
  endpoint?: string;
  status?: string;
  created_at?: string;
  latency?: string;
  version?: string;
}

export interface DeploymentCreateRequest {
  model_id: number;
  name: string;
}

export interface DeploymentSchemaResponse {
  deployment_id?: number;
  model_name?: string;
  model_version?: string;
  target_column?: string;
  features?: FeatureSchema[] | any;
  columns?: any;
  properties?: any;
  encoded_columns?: string[];
  [key: string]: any;
}
