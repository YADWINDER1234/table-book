import { z } from 'zod';

// Authentication schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone format'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Booking schemas
export const createBookingSchema = z.object({
  tableId: z.string().min(1, 'Table is required'),
  guestName: z.string().min(2, 'Guest name is required'),
  guestEmail: z.string().email('Invalid email address'),
  guestPhone: z.string().regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone format'),
  numberOfGuests: z.number().min(1, 'At least 1 guest required').max(12, 'Maximum 12 guests'),
  bookingDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  specialRequests: z.string().optional(),
  durationMinutes: z.number().min(30).max(480).optional(),
});

export const updateBookingSchema = z.object({
  startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').optional(),
  endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').optional(),
  specialRequests: z.string().optional(),
  numberOfGuests: z.number().min(1).max(12).optional(),
});

// Table schemas
export const createTableSchema = z.object({
  tableNumber: z.number().int().positive(),
  capacity: z.enum(['2', '4', '6', '8']).transform(Number),
  location: z.enum(['window', 'patio', 'indoor', 'private']),
  description: z.string().optional(),
});

export const updateTableSchema = z.object({
  capacity: z.enum(['2', '4', '6', '8']).transform(Number).optional(),
  location: z.enum(['window', 'patio', 'indoor', 'private']).optional(),
  isActive: z.boolean().optional(),
  description: z.string().optional(),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type CreateTableInput = z.infer<typeof createTableSchema>;
export type UpdateTableInput = z.infer<typeof updateTableSchema>;
