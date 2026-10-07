export interface PredictionRequest {
  features: Record<string, any>;
}

export interface PredictionResponse {
  prediction?: any;
  predicted_value?: any;
  result?: any;
  deployment?: string;
  [key: string]: any;
}

export interface PredictionHistoryItem {
  id: number;
  deployment: string;
  prediction: any;
  time: string;
}
