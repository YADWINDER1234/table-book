import { useState, useCallback } from 'react';
import { Table } from '../types';
import { bookingService } from '../services/bookingService';

export const useTables = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [availableTables, setAvailableTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTables = useCallback(async (filters?: Record<string, any>) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await bookingService.getAllTables(filters);
      setTables(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to fetch tables';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAvailableTables = useCallback(
    async (date: string, startTime: string, endTime: string, capacity: number) => {
      try {
        setIsLoading(true);
        setError(null);
        const { availableTables: data } = await bookingService.getAvailableTables(date, startTime, endTime, capacity);
        setAvailableTables(data);
      } catch (err: any) {
        const errorMessage = err.response?.data?.error?.message || 'Failed to fetch available tables';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    tables,
    availableTables,
    isLoading,
    error,
    fetchTables,
    fetchAvailableTables,
  };
};
