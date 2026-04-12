export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface Table {
  _id: string;
  tableNumber: number;
  capacity: number;
  location: 'window' | 'patio' | 'indoor' | 'private';
  isActive: boolean;
  description?: string;
}

export interface Booking {
  _id: string;
  bookingId: string;
  userId: string;
  tableId: Table;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  numberOfGuests: number;
  bookingDate: Date | string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  message?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface BookingFormData {
  tableId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  numberOfGuests: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  specialRequests?: string;
}

export interface DashboardStats {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalTables: number;
  occupancyRate: number;
}

export interface AnalyticsData {
  summary: DashboardStats;
  todayBookings: {
    count: number;
    bookings: Booking[];
  };
  trend: Array<{
    _id: string;
    count: number;
  }>;
}
