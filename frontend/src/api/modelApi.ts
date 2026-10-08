import apiClient from './client';
import type { Experiment, RegisteredModel, ModelRegisterRequest } from '../types/model';

export const modelApi = {
  getExperiments: async (): Promise<Experiment[]> => {
    const res = await apiClient.get<Experiment[]>('/experiments');
    return res.data;
  },

  getModels: async (): Promise<RegisteredModel[]> => {
    const res = await apiClient.get<RegisteredModel[]>('/models');
    return res.data;
  },

  registerModel: async (data: ModelRegisterRequest): Promise<{ success: boolean; model: RegisteredModel }> => {
    const res = await apiClient.post<{ success: boolean; model: RegisteredModel }>('/models', data);
    return res.data;
  },
};

export default modelApi;
