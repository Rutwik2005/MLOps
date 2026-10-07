import apiClient from './client';
import type { Deployment, DeploymentCreateRequest, DeploymentSchemaResponse } from '../types/deployment';
import type { PredictionRequest, PredictionResponse } from '../types/prediction';

export const deploymentApi = {
  getDeployments: async (): Promise<Deployment[]> => {
    const res = await apiClient.get<Deployment[]>('/deployments');
    return res.data;
  },

  deployModel: async (
    modelId: string | number,
    data: DeploymentCreateRequest
  ): Promise<{ success: boolean; deployment: Deployment }> => {
    const res = await apiClient.post<{ success: boolean; deployment: Deployment }>(
      `/models/${modelId}/deploy`,
      data
    );
    return res.data;
  },

  getDeploymentSchema: async (deploymentName: string): Promise<DeploymentSchemaResponse> => {
    const res = await apiClient.get<DeploymentSchemaResponse>(
      `/deployments/${deploymentName}/schema`
    );
    return res.data;
  },

  predict: async (
    deploymentName: string,
    data: PredictionRequest
  ): Promise<PredictionResponse> => {
    const res = await apiClient.post<PredictionResponse>(
      `/predict/${deploymentName}`,
      data
    );
    return res.data;
  },
};

export default deploymentApi;
