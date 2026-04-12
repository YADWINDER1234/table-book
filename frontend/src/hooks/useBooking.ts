import { useState, useCallback } from 'react';
import { Booking, BookingFormData } from '../types';
import { bookingService } from '../services/bookingService';

export const useBooking = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async (filters?: Record<string, any>) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await bookingService.getUserBookings(filters);
      setBookings(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to fetch bookings';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchBookingById = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const booking = await bookingService.getBookingById(id);
      setCurrentBooking(booking);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to fetch booking';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBooking = useCallback(async (data: BookingFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      const booking = await bookingService.createBooking(data);
      setCurrentBooking(booking);
      return booking;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to create booking';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateBooking = useCallback(async (id: string, data: Partial<BookingFormData>) => {
    try {
      setIsLoading(true);
      setError(null);
      const booking = await bookingService.updateBooking(id, data);
      setCurrentBooking(booking);
      setBookings((prev) => prev.map((b) => (b._id === id ? booking : b)));
      return booking;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to update booking';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelBooking = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const booking = await bookingService.cancelBooking(id);
      setBookings((prev) => prev.map((b) => (b._id === id ? booking : b)));
      if (currentBooking?._id === id) {
        setCurrentBooking(booking);
      }
      return booking;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to cancel booking';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentBooking]);

  return {
    bookings,
    currentBooking,
    isLoading,
    error,
    fetchBookings,
    fetchBookingById,
    createBooking,
    updateBooking,
    cancelBooking,
  };
};
