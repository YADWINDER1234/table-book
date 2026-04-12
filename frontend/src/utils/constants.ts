export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

export const TABLE_LOCATIONS = ['window', 'patio', 'indoor', 'private'];
export const TABLE_CAPACITIES = [2, 4, 6, 8];

export const BUSINESS_HOURS = {
  OPEN: 10,
  CLOSE: 22,
};

export const BOOKING_DURATION_OPTIONS = [30, 60, 90, 120, 180];

export const MESSAGES = {
  SUCCESS: {
    BOOKING_CREATED: 'Booking created successfully!',
    BOOKING_UPDATED: 'Booking updated successfully!',
    BOOKING_CANCELLED: 'Booking cancelled successfully!',
    LOGIN_SUCCESS: 'Welcome back!',
    SIGNUP_SUCCESS: 'Account created successfully!',
  },
  ERROR: {
    BOOKING_CONFLICT: 'Time slot is not available for this table',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_EXISTS: 'Email already registered',
    SOMETHING_WRONG: 'Something went wrong. Please try again.',
  },
};
