import apiClient from './client';
import type { AuthResponse, RegisterCredentials, SessionResponse } from '../types/auth';

export const authApi = {
  login: async (formData: FormData): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', formData);
    return res.data;
  },

  register: async (credentials: RegisterCredentials): Promise<{ message: string }> => {
    const res = await apiClient.post<{ message: string }>('/auth/register', credentials);
    return res.data;
  },

  getSession: async (): Promise<SessionResponse> => {
    const res = await apiClient.get<SessionResponse>('/auth/session');
    return res.data;
  },
};

export default authApi;
