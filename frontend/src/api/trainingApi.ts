import apiClient from './client';
import type { TrainingJob, TrainingRequest } from '../types/training';

export const trainingApi = {
  getTrainingJobs: async (): Promise<TrainingJob[]> => {
    const res = await apiClient.get<TrainingJob[]>('/training/jobs');
    return res.data;
  },

  startTraining: async (data: TrainingRequest): Promise<any> => {
    const res = await apiClient.post('/training/jobs', data);
    return res.data;
  },
};

export default trainingApi;
