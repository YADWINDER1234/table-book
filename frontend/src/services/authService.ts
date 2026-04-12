import { apiClient } from './api';
import { User, ApiResponse } from '../types';

interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export const authService = {
  register: (data: RegisterData): Promise<LoginResponse> => apiClient.post('/auth/register', data),

  login: (email: string, password: string): Promise<LoginResponse> =>
    apiClient.post('/auth/login', { email, password }),

  refreshToken: (refreshToken: string): Promise<{ accessToken: string }> =>
    apiClient.post('/auth/refresh', { refreshToken }),

  logout: (): Promise<void> => apiClient.post('/auth/logout'),

  getCurrentUser: (): Promise<User> => apiClient.get('/auth/me'),
};
