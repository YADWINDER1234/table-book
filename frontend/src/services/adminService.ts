import { apiClient } from './api';
import { Booking, Table, AnalyticsData } from '../types';

export const adminService = {
  // Bookings
  getAllBookings: (filters?: Record<string, any>): Promise<any> => {
    const params = new URLSearchParams(filters).toString();
    return apiClient.get(`/admin/bookings${params ? `?${params}` : ''}`);
  },

  getBookingStats: (filters?: Record<string, any>): Promise<any> => {
    const params = new URLSearchParams(filters).toString();
    return apiClient.get(`/admin/bookings/stats${params ? `?${params}` : ''}`);
  },

  updateBookingStatus: (id: string, status: string, notes?: string): Promise<Booking> =>
    apiClient.put(`/admin/bookings/${id}/status`, { status, notes }),

  // Analytics
  getDashboardAnalytics: (): Promise<AnalyticsData> => apiClient.get('/admin/analytics/dashboard'),

  // Tables
  getAllTables: (filters?: Record<string, any>): Promise<Table[]> => {
    const params = new URLSearchParams(filters).toString();
    return apiClient.get(`/admin/tables${params ? `?${params}` : ''}`);
  },

  getTableById: (id: string): Promise<Table> => apiClient.get(`/admin/tables/${id}`),

  createTable: (data: Omit<Table, '_id'>): Promise<Table> => apiClient.post('/admin/tables', data),

  updateTable: (id: string, data: Partial<Table>): Promise<Table> => apiClient.put(`/admin/tables/${id}`, data),

  deleteTable: (id: string): Promise<void> => apiClient.delete(`/admin/tables/${id}`),
};
