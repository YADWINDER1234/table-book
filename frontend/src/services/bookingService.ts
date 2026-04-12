import { apiClient } from './api';
import { Booking, Table, BookingFormData, ApiResponse } from '../types';

export const bookingService = {
  // ========== EXISTING BOOKING METHODS ==========
  getAvailableTables: (
    date: string,
    startTime: string,
    endTime: string,
    capacity: number
  ): Promise<{ availableTables: Table[]; totalAvailable: number }> =>
    apiClient.get(`/tables/available?date=${date}&startTime=${startTime}&endTime=${endTime}&capacity=${capacity}`),

  getAllTables: (filters?: Record<string, any>): Promise<Table[]> => {
    const params = new URLSearchParams(filters).toString();
    return apiClient.get(`/tables${params ? `?${params}` : ''}`);
  },

  createBooking: (data: BookingFormData): Promise<Booking> => apiClient.post('/bookings', data),

  getUserBookings: (filters?: Record<string, any>): Promise<Booking[]> => {
    const params = new URLSearchParams(filters).toString();
    return apiClient.get(`/bookings${params ? `?${params}` : ''}`);
  },

  getBookingById: (id: string): Promise<Booking> => apiClient.get(`/bookings/${id}`),

  updateBooking: (id: string, data: Partial<BookingFormData>): Promise<Booking> =>
    apiClient.put(`/bookings/${id}`, data),

  cancelBooking: (id: string): Promise<Booking> => apiClient.delete(`/bookings/${id}`),

  // ========== MENU SERVICE ==========
  getAllMenuItems: (): Promise<any> => apiClient.get('/menu'),
  getMenuByCategory: (): Promise<any> => apiClient.get('/menu/by-category'),
  getMenuStats: (): Promise<any> => apiClient.get('/menu/stats'),

  // ========== REVIEW SERVICE ==========
  submitReview: (bookingId: string, reviewData: any): Promise<any> =>
    apiClient.post('/reviews', { bookingId, ...reviewData }),
  getReviewsByTable: (tableId: string): Promise<any> =>
    apiClient.get(`/reviews/table/${tableId}`),
  getReviewStats: (): Promise<any> => apiClient.get('/reviews/stats'),
  markReviewHelpful: (reviewId: string, helpful: boolean): Promise<any> =>
    apiClient.patch(`/reviews/${reviewId}/helpful`, { helpful }),

  // ========== LOYALTY SERVICE ==========
  getLoyaltyData: (): Promise<any> => apiClient.get('/loyalty/my-loyalty'),
  getLoyaltyTransactions: (): Promise<any> => apiClient.get('/loyalty/transactions'),
  redeemPoints: (points: number): Promise<any> =>
    apiClient.post('/loyalty/redeem', { points }),
  checkBirthdayBonus: (): Promise<any> => apiClient.get('/loyalty/birthday-bonus'),

  // ========== PROMO CODE SERVICE ==========
  validatePromoCode: (code: string): Promise<any> =>
    apiClient.post('/promotions/validate', { code }),
  redeemPromoCode: (code: string, orderAmount: number): Promise<any> =>
    apiClient.post('/promotions/redeem', { code, orderAmount }),
  generateReferralLink: (): Promise<any> =>
    apiClient.post('/promotions/referral/generate', {}),
  completeReferral: (referralCode: string): Promise<any> =>
    apiClient.post('/promotions/referral/complete', { referralCode }),

  // ========== EVENT SERVICE ==========
  createGroupEvent: (eventData: any): Promise<any> =>
    apiClient.post('/events', eventData),
  getEventPackages: (): Promise<any> => apiClient.get('/events/packages'),
  getEventById: (id: string): Promise<any> => apiClient.get(`/events/${id}`),
  generateEventProposal: (id: string): Promise<any> =>
    apiClient.get(`/events/${id}/proposal`),

  // ========== ORDER SERVICE ==========
  createOrder: (orderData: any): Promise<any> =>
    apiClient.post('/orders', orderData),
  getOrdersByBooking: (bookingId: string): Promise<any> =>
    apiClient.get(`/orders/booking/${bookingId}`),
  getOrderById: (id: string): Promise<any> =>
    apiClient.get(`/orders/${id}`),
  cancelOrder: (id: string): Promise<any> =>
    apiClient.patch(`/orders/${id}/cancel`, {}),
  splitBill: (orderId: string, numberOfWays: number): Promise<any> =>
    apiClient.post(`/orders/${orderId}/split-bill`, { numberOfWays }),

  // ========== PAYMENT SERVICE ==========
  createPaymentIntent: (amount: number, bookingId: string): Promise<any> =>
    apiClient.post('/payments/create-intent', { amount, bookingId }),
  confirmPayment: (paymentIntentId: string): Promise<any> =>
    apiClient.post('/payments/confirm', { paymentIntentId }),
};
